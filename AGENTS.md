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

- Linsy UI lives in src/components/linsy; the base category and commune labels in src/lib/catalog.ts match the database seeds — keep slugs stable since URLs use them.
- Account and workspace actions require a configured Linsy Neon backend. With no connection configured, show the design previews with actions disabled.
- BusinessEditor keeps unsaved inputs and object URLs in component state. With a backend connection, private media is uploaded through the server when saving and an approved revision stays visible until the replacement is approved.
- Shared leaf-route metadata is provided by src/lib/page-meta.ts for new pages, so each has its own app-specific social and search metadata.
