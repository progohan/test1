#!/bin/bash

# Eduardo's Portfolio - GitHub Pages Deployment Script
# This script helps you deploy the portfolio to GitHub Pages

echo "🚀 Eduardo's Portfolio - GitHub Pages Deployment Helper"
echo "======================================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: This directory is not a Git repository."
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Get GitHub username and repository name
echo "📝 Please provide your GitHub details:"
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: eduardo-portfolio-github): " REPO_NAME

# Set default repo name if not provided
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="EFernandezOrtiz"
fi

echo ""
echo "🔧 Configuration:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Confirm before proceeding
read -p "Is this correct? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo ""
echo "🔄 Setting up remote repository..."

# Remove existing origin if it exists
git remote remove origin 2>/dev/null || true

# Add the new remote
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "✅ Remote repository configured."
echo ""

# Update README with correct URLs
echo "📝 Updating README with your repository information..."
sed -i.bak "s|\[username\]|$GITHUB_USERNAME|g" README.md
rm README.md.bak 2>/dev/null || true

# Commit the updated README
git add README.md
git commit -m "Update README with repository URLs" 2>/dev/null || echo "ℹ️  README already up to date"

echo "✅ README updated with your repository information."
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "   You may be prompted for your GitHub credentials."
echo ""

# Push to main branch
if git push -u origin main; then
    echo ""
    echo "🎉 SUCCESS! Your portfolio has been pushed to GitHub!"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "   2. Click 'Settings' tab"
    echo "   3. Scroll to 'Pages' in the left sidebar"
    echo "   4. Under 'Source', select 'GitHub Actions'"
    echo ""
    echo "🌐 Your website will be available at:"
    echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    echo ""
    echo "⏱️  Deployment usually takes 1-3 minutes to complete."
    echo "   Check the 'Actions' tab to monitor deployment progress."
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo ""
    echo "❌ Error: Failed to push to GitHub."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Make sure you've created the repository on GitHub first"
    echo "   2. Ensure the repository name matches exactly"
    echo "   3. Check your GitHub credentials"
    echo "   4. Make sure the repository is public (required for free GitHub Pages)"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions."
    exit 1
fi
