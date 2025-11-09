# Deployment Guide

School Equipment Lending Portal - Production Deployment

## Prerequisites

- GitHub repository with your code
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Environment variables configured

## Step 1: Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster
2. Add a database user with strong password
3. Whitelist IP addresses (or 0.0.0.0 for development)
4. Copy connection string:
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/school-equipment?retryWrites=true&w=majority
   \`\`\`

## Step 2: Configure Environment Variables

Create a \`.env.local\` file locally:

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-equipment
JWT_SECRET=your_very_long_secret_key_minimum_32_characters_recommended
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

For production, use actual values.

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure project name
5. Add environment variables in "Environment Variables" section:
   - MONGODB_URI
   - JWT_SECRET
   - NEXT_PUBLIC_API_URL
6. Click "Deploy"

### Option B: Using Vercel CLI

\`\`\`bash
npm install -g vercel
vercel login
vercel deploy
\`\`\`

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test registration and login
3. Create test equipment
4. Make a borrowing request
5. Verify notifications appear

## Step 5: Configure Production Domain

1. In Vercel dashboard, go to project settings
2. Add your custom domain
3. Update DNS records per Vercel instructions
4. Update NEXT_PUBLIC_API_URL environment variable

## Environment Variables for Production

Set these in Vercel project settings:

| Variable | Value | Notes |
|----------|-------|-------|
| MONGODB_URI | production_db_url | MongoDB Atlas production cluster |
| JWT_SECRET | strong_secret | Minimum 32 characters, use `openssl rand -hex 16` |
| NEXT_PUBLIC_API_URL | https://yourdomain.com | Production domain |

## Database Backups

MongoDB Atlas provides:
- Daily automated backups
- 30-day backup retention
- Point-in-time recovery

Enable in MongoDB Atlas > Backup settings.

## Monitoring & Logs

### Vercel Logs
- View in Vercel dashboard > Deployments > Logs
- Check function logs and edge logs

### Database Monitoring
- Use MongoDB Atlas monitoring dashboard
- Check replication status
- Monitor query performance

## Troubleshooting Deployment Issues

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure MongoDB connection string is valid
4. Check for TypeScript errors: \`npm run build\`

### Runtime Errors
1. Check function logs in Vercel dashboard
2. Verify MONGODB_URI is correct
3. Ensure JWT_SECRET is set
4. Check MongoDB network access

### Database Connection Issues
1. Verify IP whitelist in MongoDB Atlas
2. Check connection string format
3. Confirm database user password
4. Test connection locally first

## Scaling for Production

### For 1000+ Concurrent Users

1. **MongoDB Atlas**: Upgrade to M2+ cluster
2. **Vercel**: Already auto-scales on Pro plan
3. **Caching**: Consider Redis for frequently accessed data
4. **Rate Limiting**: Implement API rate limiting
5. **CDN**: Vercel includes Edge Network

### Database Optimization

1. Add database indexes (done automatically)
2. Use aggregation pipelines for reports
3. Consider database replication
4. Monitor query performance

## Security Checklist

- [ ] MongoDB user has strong password
- [ ] JWT secret is long and random
- [ ] Environment variables not in git
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Database backups enabled
- [ ] Rate limiting considered
- [ ] Input validation implemented
- [ ] CORS properly configured

## Rollback Procedure

If deployment fails:

1. Go to Vercel dashboard
2. Find previous successful deployment
3. Click the three dots menu
4. Select "Promote to Production"

Or redeploy from git:
\`\`\`bash
git revert <commit-hash>
git push origin main
\`\`\`

## Performance Optimization

### Frontend
- Images optimized via Next.js Image component
- CSS minified automatically
- JavaScript code-split automatically
- Lighthouse score target: > 90

### Backend
- Database queries indexed
- Pagination implemented (default: 10 items/page)
- Error handling comprehensive
- Response times target: < 200ms

### Monitoring Performance

Use:
- Vercel Analytics (built-in)
- Web Vitals dashboard
- MongoDB performance monitoring
- Third-party tools: New Relic, DataDog

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Community: GitHub Discussions
