export default function PortalUserDetail({
  params,
}: {
  params: { id: string };
}) {
  return <div>{params.id}</div>;
}
