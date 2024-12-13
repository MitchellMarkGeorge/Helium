import "./Spinner.scss";

interface Props {
  size: string | number;
}

export default function Spinner({ size }: Props) {
  return <span className="spinner" style={{ height: size, width: size }} />;
}
