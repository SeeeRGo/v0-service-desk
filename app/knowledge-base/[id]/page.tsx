import KBArticleView from "@/components/knowledge-base/kb-article-view"

export default function KBArticlePage({ params }: { params: { id: string } }) {
  return <KBArticleView articleId={params.id} />
}
