const ExternalWebsite = () => {
  return (
    <div style={{ width: "100%", height: "100vh", textAlign: "center" }}>
      <h2>Embedded Website</h2>
      <iframe
        src="/index.html"  // If your `index.html` is inside `public/` folder
        width="80%"
        height="500px"
        style={{ border: "1px solid #ddd", borderRadius: "10px" }}
        title="Embedded Website"
      ></iframe>
    </div>
  );
};

export default ExternalWebsite;
