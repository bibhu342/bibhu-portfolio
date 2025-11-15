#!/usr/bin/env python3
"""
RSS Feed and Sitemap Generator

Reads projects.json and generates feed.xml and updates sitemap.xml
"""

import json
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

def load_projects():
    """Load projects from JSON file"""
    projects_file = Path(__file__).parent.parent / 'data' / 'projects.json'
    with open(projects_file, 'r') as f:
        return json.load(f)

def generate_rss_feed(projects_data):
    """Generate RSS feed XML"""
    projects = projects_data['projects']
    
    rss = ET.Element('rss', version='2.0')
    rss.set('xmlns:atom', 'http://www.w3.org/2005/Atom')
    
    channel = ET.SubElement(rss, 'channel')
    
    # Channel metadata
    ET.SubElement(channel, 'title').text = 'Bibhudendu Behera - Project Updates'
    ET.SubElement(channel, 'link').text = 'https://bibhu342.github.io/bibhu-portfolio/'
    ET.SubElement(channel, 'description').text = 'Latest projects and updates from Bibhudendu Behera - Data Automation & Python Engineer'
    ET.SubElement(channel, 'language').text = 'en-us'
    ET.SubElement(channel, 'lastBuildDate').text = datetime.now().strftime('%a, %d %b %Y %H:%M:%S %z')
    ET.SubElement(channel, 'generator').text = 'Python RSS Generator'
    
    # Self-reference
    atom_link = ET.SubElement(channel, 'atom:link')
    atom_link.set('href', 'https://bibhu342.github.io/bibhu-portfolio/feed.xml')
    atom_link.set('rel', 'self')
    atom_link.set('type', 'application/rss+xml')
    
    # Add project items (most recent first)
    sorted_projects = sorted(projects, key=lambda x: x['date'], reverse=True)
    
    for project in sorted_projects[:10]:  # Latest 10 projects
        item = ET.SubElement(channel, 'item')
        
        ET.SubElement(item, 'title').text = project['title']
        ET.SubElement(item, 'link').text = project.get('url', 'https://bibhu342.github.io/bibhu-portfolio/')
        ET.SubElement(item, 'description').text = project['description']
        ET.SubElement(item, 'guid').text = f"project-{project['id']}"
        
        # Convert date to RFC 2822 format
        project_date = datetime.strptime(project['date'], '%Y-%m-%d')
        ET.SubElement(item, 'pubDate').text = project_date.strftime('%a, %d %b %Y %H:%M:%S %z')
        
        # Categories (tech stack)
        for tech in project['tech']:
            ET.SubElement(item, 'category').text = tech
    
    return rss

def update_sitemap(projects_data):
    """Update sitemap.xml with project pages"""
    projects = projects_data['projects']
    
    # Create sitemap
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Add main page
    url = ET.SubElement(urlset, 'url')
    ET.SubElement(url, 'loc').text = 'https://bibhu342.github.io/bibhu-portfolio/'
    ET.SubElement(url, 'lastmod').text = datetime.now().strftime('%Y-%m-%d')
    ET.SubElement(url, 'changefreq').text = 'monthly'
    ET.SubElement(url, 'priority').text = '1.0'
    
    # Add project pages (if they have dedicated URLs)
    for project in projects:
        if project.get('url') and 'github.io' in project['url']:
            url = ET.SubElement(urlset, 'url')
            ET.SubElement(url, 'loc').text = project['url']
            ET.SubElement(url, 'lastmod').text = project['date']
            ET.SubElement(url, 'changefreq').text = 'yearly'
            ET.SubElement(url, 'priority').text = '0.8'
    
    return urlset

def write_xml(element, filepath):
    """Write XML element to file with proper formatting"""
    # Create pretty XML
    rough_string = ET.tostring(element, encoding='unicode')
    
    # Add XML declaration and format
    xml_content = f'<?xml version="1.0" encoding="UTF-8"?>\n{rough_string}'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(xml_content)

def main():
    """Main execution function"""
    # Load projects data
    projects_data = load_projects()
    
    # Generate RSS feed
    rss_feed = generate_rss_feed(projects_data)
    feed_path = Path(__file__).parent.parent / 'feed.xml'
    write_xml(rss_feed, feed_path)
    print(f"Generated RSS feed: {feed_path}")
    
    # Update sitemap
    sitemap = update_sitemap(projects_data)
    sitemap_path = Path(__file__).parent.parent / 'sitemap.xml'
    write_xml(sitemap, sitemap_path)
    print(f"Updated sitemap: {sitemap_path}")
    
    print(f"Processed {len(projects_data['projects'])} projects")

if __name__ == '__main__':
    main()