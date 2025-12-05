import { PageLayout } from "@/pages/PageLayout";


const Telescope = () => {
  return (
    <PageLayout>
      

      <section>
       

        <div style={{ width: "100%", height: "80vh", display: "flex" }}>
          <iframe
            title="WorldWide Telescope"
            src="https://worldwidetelescope.org/webclient/"
            style={{ border: "none", width: "100%", height: "100%" }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          >
            Your browser does not support iframes. Open /wwt/index.html directly.
          </iframe>
        </div>
      </section>
    </PageLayout>
  );
};

export default Telescope;
