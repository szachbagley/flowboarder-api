#!/bin/bash
# Quick API test script

BASE_URL="http://localhost:3000/api"

echo "Testing Flowboarder API..."
echo ""

# Test health check
echo "1. Health check:"
curl -s http://localhost:3000/health | jq
echo ""

# Test welcome
echo "2. Welcome:"
curl -s $BASE_URL | jq
echo ""

# Create user
echo "3. Create user:"
curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@flowboarder.com","name":"Test User"}' | jq
echo ""

# Create project
echo "4. Create project:"
curl -s -X POST $BASE_URL/projects \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"project_title":"Test Project","art_style":"Cyberpunk"}' | jq
echo ""

# Get all projects
echo "5. Get all projects:"
curl -s $BASE_URL/projects | jq
echo ""

echo "✓ API tests complete!"
