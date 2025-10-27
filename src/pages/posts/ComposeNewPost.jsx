import AppPageTitle from "../../components/breadcrumbs/AppPageTitle";
import PostNewEditForm from "../../components/forms/PostNewEditForm";

export default function ComposeNewPost() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AppPageTitle
        title="Compose Post"
        description="Create a new post to share with your audience."
      />
      <PostNewEditForm />
    </div>
  );
}
