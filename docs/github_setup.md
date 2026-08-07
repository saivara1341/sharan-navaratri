# GitHub Secrets Configuration Guide

To ensure your application's connection to Supabase works correctly when deployed via GitHub Actions, you need to configure the following secrets in your repository.

## Steps to Add Secrets

1.  Navigate to your GitHub repository.
2.  Click on **Settings** (top tab).
3.  On the left sidebar, expand **Secrets and variables** and click **Actions**.
4.  Click the **New repository secret** button for each variable listed below.

## Required Secrets

| Secret Name | Description | Value |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL | `https://xoqpxckowwubeqdtazks.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key | `sb_publishable_Db5k1uOh50NIY-GPvMm0HQ_OMnOz8D7` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase Publishable Key | `sb_publishable_Db5k1uOh50NIY-GPvMm0HQ_OMnOz8D7` |

## Why is this necessary?

By default, `.env` files are ignored by Git (for security). When GitHub Actions builds your project, it needs these environment variables to be available so it can "bake" them into the final production build (`dist/` folder).

> [!IMPORTANT]
> Never commit your `.env` file to your public repository. Always use GitHub Secrets for managing sensitive keys.
