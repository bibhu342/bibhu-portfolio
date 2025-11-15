#!/usr/bin/env python3
"""
Social Media Post Generator

Generates pre-filled social media posts for new project launches
"""

import json
import sys
from datetime import datetime
from pathlib import Path

def load_projects():
    """Load projects from JSON file"""
    projects_file = Path(__file__).parent.parent.parent / 'data' / 'projects.json'
    with open(projects_file, 'r') as f:
        return json.load(f)

def generate_twitter_post(project):
    """Generate Twitter/X post template"""
    hashtags = []
    
    # Add tech hashtags
    tech_hashtag_map = {
        'Python': '#Python',
        'JavaScript': '#JavaScript', 
        'React': '#ReactJS',
        'Node.js': '#NodeJS',
        'FastAPI': '#FastAPI',
        'Pandas': '#DataScience',
        'Scrapy': '#WebScraping',
        'Selenium': '#Automation',
        'Docker': '#Docker',
        'AWS': '#AWS',
        'PostgreSQL': '#PostgreSQL'
    }
    
    for tech in project['tech']:
        if tech in tech_hashtag_map:
            hashtags.append(tech_hashtag_map[tech])
    
    # Add general hashtags
    hashtags.extend(['#DataAutomation', '#PythonDeveloper', '#OpenSource'])
    
    # Limit hashtags to avoid spam
    hashtags = hashtags[:6]
    
    post_templates = [
        f"""🚀 Just launched: {project['title']}!

{project['summary']}

🔧 Built with: {', '.join(project['tech'][:3])}
🔗 Check it out: {project['url']}

{' '.join(hashtags)}

#BuildInPublic #IndieHacker""",

        f"""✨ New project alert! 

{project['title']} - {project['summary']}

Perfect for developers who need {project['tech'][0].lower()} solutions.

Live demo: {project['url']}

{' '.join(hashtags)}""",

        f"""📊 Data automation made simple!

Just released {project['title']}: {project['summary']}

Tech stack: {' • '.join(project['tech'][:4])}

GitHub: {project['url']}

{' '.join(hashtags)}

What would you build with this? 👇"""
    ]
    
    return post_templates

def generate_linkedin_post(project):
    """Generate LinkedIn post template"""
    post_templates = [
        f"""🎯 Excited to share my latest project: {project['title']}

{project['description']}

🔹 Key Technologies: {', '.join(project['tech'])}
🔹 Use Cases: Data processing, workflow automation, business intelligence
🔹 Open Source: Available on GitHub

This project demonstrates my approach to solving real-world data challenges with clean, maintainable code and robust architecture.

👉 Check it out: {project['url']}

What data automation challenges are you currently facing? I'd love to help solve them!

#DataAutomation #PythonDevelopment #DataEngineering #SoftwareDevelopment #OpenSource #DataScience""",

        f"""💡 Problem-solving in action: {project['title']}

I built this solution to address a common challenge in data processing: {project['summary'].lower()}

🚀 What makes it special:
• Scalable Python architecture
• Production-ready error handling  
• Comprehensive documentation
• Easy integration with existing workflows

The project showcases modern development practices including automated testing, CI/CD, and clean code principles.

Available now: {project['url']}

Looking for custom data automation solutions? Let's connect and discuss your specific needs.

#PythonDeveloper #DataAutomation #FreelanceDeveloper #TechSolutions""",

        f"""📈 New release: {project['title']}

As a data automation specialist, I'm constantly building tools that make complex data workflows simple and reliable.

This latest project offers:
✅ {project['summary']}
✅ Built with {', '.join(project['tech'][:3])}
✅ Production-ready and well-documented

Whether you're dealing with large datasets, need custom automation, or want to streamline your data processes, I can help build the right solution.

Project details: {project['url']}

#DataEngineering #Automation #BusinessSolutions #FreelanceServices"""
    ]
    
    return post_templates

def generate_social_posts(project_id=None):
    """Generate social media posts for a specific project or latest project"""
    projects_data = load_projects()
    projects = projects_data['projects']
    
    if project_id:
        project = next((p for p in projects if p['id'] == project_id), None)
        if not project:
            print(f"Project with ID '{project_id}' not found")
            return
    else:
        # Use the most recent project
        project = max(projects, key=lambda x: x['date'])
    
    print(f"Generating social posts for: {project['title']}")
    print("=" * 50)
    
    # Generate Twitter posts
    twitter_posts = generate_twitter_post(project)
    print("\n🐦 TWITTER/X POST OPTIONS:")
    for i, post in enumerate(twitter_posts, 1):
        print(f"\n--- Option {i} ---")
        print(post)
        print(f"Character count: {len(post)}")
    
    # Generate LinkedIn posts  
    linkedin_posts = generate_linkedin_post(project)
    print("\n\n💼 LINKEDIN POST OPTIONS:")
    for i, post in enumerate(linkedin_posts, 1):
        print(f"\n--- Option {i} ---")
        print(post)
        print(f"Character count: {len(post)}")
    
    # Save to files
    output_dir = Path(__file__).parent / 'generated'
    output_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    with open(output_dir / f'twitter_posts_{project["id"]}_{timestamp}.txt', 'w') as f:
        f.write(f"Twitter/X Posts for: {project['title']}\n")
        f.write("=" * 50 + "\n\n")
        for i, post in enumerate(twitter_posts, 1):
            f.write(f"Option {i}:\n{post}\n\n")
    
    with open(output_dir / f'linkedin_posts_{project["id"]}_{timestamp}.txt', 'w') as f:
        f.write(f"LinkedIn Posts for: {project['title']}\n")
        f.write("=" * 50 + "\n\n")
        for i, post in enumerate(linkedin_posts, 1):
            f.write(f"Option {i}:\n{post}\n\n")
    
    print(f"\n📁 Posts saved to: {output_dir}")

if __name__ == '__main__':
    project_id = sys.argv[1] if len(sys.argv) > 1 else None
    generate_social_posts(project_id)