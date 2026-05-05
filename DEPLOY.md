# Deploying the Maskit landing page to Netlify

There are two paths. Pick whichever fits.

## Option A — One-click in the Netlify UI (fastest, ~2 min)

1. Sign in at https://app.netlify.com.
2. **Add new site → Import an existing project → GitHub**.
3. Pick the repository `furyoktria/furyoktria`.
4. Set **Branch to deploy** = `maskit-landing`.
5. **Build command**: leave empty. **Publish directory**: `.` (already set in `netlify.toml`).
6. Click **Deploy**. Netlify will give you a `*.netlify.app` URL within ~30 s.

That's it. Subsequent pushes to `maskit-landing` auto-deploy.

## Option B — Auto-deploy via GitHub Actions

The workflow at `.github/workflows/deploy-netlify.yml` will publish on every push
to `maskit-landing` once you add two repository secrets:

1. Generate a personal access token at https://app.netlify.com/user/applications#personal-access-tokens.
2. Create a Netlify site (UI or `netlify sites:create`) and copy its **Site ID**
   (Site settings → General → Site information → API ID).
3. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**:
   - `NETLIFY_AUTH_TOKEN` = the personal access token from step 1
   - `NETLIFY_SITE_ID` = the Site ID from step 2
4. Re-run the workflow from the **Actions** tab, or push any commit to `maskit-landing`.

## Option C — One-shot from your laptop

```bash
npx netlify-cli deploy --prod --dir=.
```

The CLI will walk you through auth and site selection.
