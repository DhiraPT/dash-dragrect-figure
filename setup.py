import io
import json
from setuptools import setup


with open('package.json') as f:
    package = json.load(f)

package_name = package["name"].replace(" ", "_").replace("-", "_")

setup(
    name=package_name,
    version=package["version"],
    author=package['author'],
    author_email=package['author'].split('<')[1].strip(),
    url=package['homepage'],
    packages=[package_name],
    include_package_data=True,
    license=package['license'],
    description=package.get('description', package_name),
    long_description=io.open('README.md', encoding='utf-8').read(),
    long_description_content_type='text/markdown',
    install_requires=['dash>=2.5.1'],
    python_requires='>=3.8',
    classifiers=[
        'Framework :: Dash',
    ],
)
