import CryptoDetail from "@/components/crypto/crypto-detail"

export default function CryptoPage({ params }: { params: { id: string } }) {
  return <CryptoDetail coinId={params.id} />
}

