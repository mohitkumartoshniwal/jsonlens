import Header from "../src/components/Header";
import Main from "../src/components/UI/Main";
import Loader from "../src/components/UI/Loader";

export default function Page(): JSX.Element {
  return (
    <>
      <Loader />
      <Header />
      <Main />
    </>
  );
}
