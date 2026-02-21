#!/bin/bash

echo "=== Green Link Logistics SSL Setup ==="
echo ""
echo "This script will install SSL certificates using Let's Encrypt"
echo "Make sure your DNS has propagated before running this!"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Install certbot
echo "Installing certbot..."
sudo apt-get update
sudo apt-get install -y certbot

# Stop nginx temporarily
echo "Stopping nginx..."
cd ~/green-link-logistics
sudo docker-compose stop nginx

# Get SSL certificate
echo "Obtaining SSL certificate..."
sudo certbot certonly --standalone -d greenlink.website -d www.greenlink.website \
  --non-interactive --agree-tos --email your-email@example.com

# Check if certificate was obtained
if [ -f /etc/letsencrypt/live/greenlink.website/fullchain.pem ]; then
    echo "✓ SSL certificate obtained successfully!"
    
    # Update nginx configuration to enable HTTPS
    echo "Would you like to enable HTTPS in nginx config? (y/n)"
    read -p "> " enable_https
    
    if [ "$enable_https" = "y" ]; then
        echo "Please manually uncomment the HTTPS server block in nginx/nginx.conf"
        echo "and comment out the HTTP redirect section"
    fi
    
    # Restart nginx with SSL
    echo "Starting nginx with SSL..."
    sudo docker-compose up -d nginx
    
    # Set up auto-renewal
    echo "Setting up SSL auto-renewal..."
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && docker-compose -f ~/green-link-logistics/docker-compose.yml restart nginx") | crontab -
    
    echo ""
    echo "✓ SSL setup complete!"
    echo "Your site is now accessible at:"
    echo "  - https://greenlink.website"
    echo "  - https://www.greenlink.website"
else
    echo "✗ Failed to obtain SSL certificate"
    echo "Make sure:"
    echo "  1. DNS has propagated (check with: nslookup greenlink.website)"
    echo "  2. Port 80 is open and accessible"
    echo "  3. Domain points to this server's IP"
    
    # Restart nginx anyway
    sudo docker-compose up -d nginx
fi
