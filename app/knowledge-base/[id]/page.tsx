import { redirect } from "next/navigation"
import KBArticleView from "@/components/knowledge-base/kb-article-view"

export default function KBArticlePage({ params }: { params: { id: string } }) {
  if (params.id === "new") {
    redirect("/knowledge-base/new")
  }

  return <KBArticleView articleId={params.id} />
}
