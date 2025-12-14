interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
}

interface SnowflakesProps {
  snowflakes: Snowflake[];
}

const Snowflakes = ({ snowflakes }: SnowflakesProps) => {
  return (
    <>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
            fontSize: `${flake.size}em`,
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
};

export default Snowflakes;
