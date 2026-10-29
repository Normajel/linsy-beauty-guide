<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Linsy UI lives in src/components/linsy; category/commune catalog is static in src/lib/catalog.ts until moved to the database (stage 2) — keep slugs stable since URLs use them.
- Pending account and workspace pages are public design previews until the external backend is connected; never perform or simulate authentication, persistence, or privileged actions in these previews.
- BusinessEditor keeps unsaved preview inputs and object-URL images in component state only, releasing URLs on removal and unmount; this allows visual review without collecting data before integration.
- Shared leaf-route metadata is provided by src/lib/page-meta.ts for new pages, so each has its own app-specific social and search metadata.
