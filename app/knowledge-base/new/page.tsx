import CreateKBArticleForm from "@/components/knowledge-base/create-kb-article-form"

export default function NewKBArticlePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Создать статью</h1>
        <p className="text-muted-foreground mt-1">Добавьте новую статью в базу знаний</p>
      </div>

      <CreateKBArticleForm />
    </div>
  )
}
