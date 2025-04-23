import useSceneStore from "./store";

const clickSound = new Audio("/sound/click.wav");

function ButtonsContainer() {
  const { flipCoinFn, setFallCoin, init, result, canFlip } = useSceneStore() as any;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {result && init && (
        <div>
          <div
            style={{
              color: "white",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            🎉{result}
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        <button
          disabled={!canFlip}
          style={{
            backgroundColor: canFlip ? "white" : "gray",
            color: "black",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            flipCoinFn();
            clickSound.play();
          }}
        >
          Flip
        </button>
        <button
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            setFallCoin(true);
            clickSound.play();
          }}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default ButtonsContainer;
