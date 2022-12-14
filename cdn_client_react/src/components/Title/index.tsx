import { Helmet } from "react-helmet-async";

interface TitleProp {
  title?: string,
}

function Title(props: TitleProp) {
  const { title = (process.env.REACT_APP_DEFAULT_TITLE ?? "Backend") } = props;
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </>
  );
}

export default Title;