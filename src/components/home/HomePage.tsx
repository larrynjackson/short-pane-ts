function Alert() {
  return (
    <div className="alert-container">
      <div className="alert alert-danger">danger</div>
      <div className="alert alert-warning">warning</div>
      <div className="alert alert-success">success</div>
      <div className="alert alert-info">info</div>
    </div>
  );
}

const HomePage = () => {
  return (
    <>
      <div className="app-container">
        <div
          style={{
            padding: '30px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h1>Home</h1>
        </div>
        <div>
          <div
            style={{
              padding: '30px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Alert />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
