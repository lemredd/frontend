interface Props {
  params: { username: string }
}
export default function ProviderProfilePage({ params: { username } }: Props) {
  return (
    <main>
      <h1>{username}</h1>
    </main>
  )
}
