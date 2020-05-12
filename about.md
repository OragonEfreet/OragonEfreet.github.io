---
layout: page
title: About Me
permalink: /about/
---

Hi! My name is Kevin. I code, I play video games, I have cats.
Also I am an orange.

---

This website is hosted on [Github](https://github.com) and is generated using [Jekyll](https://jekyllrb.com/).

[Disqus](https://disqus.com/) is used for comment.

If you find any typo or error in a post, you can help by commenting or proposing a change using the link on the bottom of each post.

Contributors:
{% for contributor in site.github.contributors %}
- ![Avatar]({{ contributor.avatar_url }}){: style="width: 30px;vertical-align:center;"}
[@{{ contributor.login }}]({{ contributor.html_url }})
{: .contributor }
{% endfor %}

