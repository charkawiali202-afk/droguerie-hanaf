import { Suspense } from "react";
import ProductView from "./ProductView";

export default function Page({ params }: PageProps<"/produits/[id]">) {
  return <Suspense>{params.then(({ id }) => <ProductView id={id} />)}</Suspense>;
}
