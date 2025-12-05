import { Newspaper, ExternalLink, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

async function fetchNASARSS(): Promise<RSSItem[]> {
  // NASA Breaking News RSS Feed
  const rssUrl = "https://www.nasa.gov/rss/dyn/breaking_news.rss";
  
  // Try multiple CORS proxy services as fallback
  const proxies = [
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
  ];
  
  let lastError: Error | null = null;
  
  // Try direct fetch first (some browsers/servers allow it)
  try {
    const directResponse = await fetch(rssUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });
    
    if (directResponse.ok) {
      const xmlText = await directResponse.text();
      return parseRSSXML(xmlText);
    }
  } catch (e) {
    // Direct fetch failed, continue to proxy methods
    lastError = e as Error;
  }
  
  // Try RSS2JSON first (returns JSON, easier to parse)
  try {
    const response = await fetch(proxies[0], {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ok' && data.items && Array.isArray(data.items)) {
        return data.items.slice(0, 10).map((item: any) => ({
          title: item.title || '',
          link: item.link || '',
          description: item.description || item.content || '',
          pubDate: item.pubDate || item.publishedDate || '',
        }));
      }
    }
  } catch (e) {
    lastError = e as Error;
  }
  
  // Try other proxies
  for (let i = 1; i < proxies.length; i++) {
    try {
      const response = await fetch(proxies[i], {
        headers: {
          'Accept': i === 1 ? 'text/xml' : 'application/json',
        },
      });
      
      if (response.ok) {
        let xmlText: string;
        if (i === 1) {
          // corsproxy.io returns XML directly
          xmlText = await response.text();
        } else {
          // allorigins.win returns JSON with contents
          const data = await response.json();
          xmlText = data.contents || data;
        }
        
        if (xmlText) {
          return parseRSSXML(xmlText);
        }
      }
    } catch (e) {
      lastError = e as Error;
      continue;
    }
  }
  
  console.error('Error fetching NASA RSS:', lastError);
  return [];
}

function parseRSSXML(xmlText: string): RSSItem[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML parsing error:', parseError.textContent);
      return [];
    }
    
    const items = xmlDoc.querySelectorAll('item');
    const feedItems: RSSItem[] = [];
    
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      if (title) {
        feedItems.push({
          title: title.trim(),
          link: link.trim(),
          description: description.trim(),
          pubDate: pubDate.trim(),
        });
      }
    });
    
    return feedItems.slice(0, 10); // Limit to 10 items
  } catch (error) {
    console.error('Error parsing RSS XML:', error);
    return [];
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const NASAFeed = () => {
  const { data: feedItems, isLoading, isError, error } = useQuery({
    queryKey: ['nasa-rss'],
    queryFn: fetchNASARSS,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 15 * 60 * 1000, // Consider stale after 15 minutes
    retry: 2,
  });

  const displayItems = useMemo(() => {
    return feedItems || [];
  }, [feedItems]);

  return (
    <section className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold tracking-wide">
              NASA DAILY NEWS
            </h2>
            <p className="text-xs text-muted-foreground">
              Latest updates from NASA
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading NASA news...
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-2">Failed to load NASA news.</p>
          <p className="text-xs">Please check your connection and try again later.</p>
          {error instanceof Error && (
            <p className="text-xs mt-2 opacity-75">{error.message}</p>
          )}
        </div>
      )}

      {!isLoading && !isError && displayItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No news available at this time.
        </div>
      )}

      {!isLoading && !isError && displayItems.length > 0 && (
        <div className="space-y-4">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="glass-panel p-4 border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.pubDate)}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                    {stripHtml(item.description)}
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Read more
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

