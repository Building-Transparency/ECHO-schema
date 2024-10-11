from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="XXXXXX",
    version="XXXXX",
    author="XXXXX",
    author_email="XXXXX",
    description="XXXXX",
    long_description="XXXXX",
    long_description_content_type="text/markdown",
    url="XXXXX",
    packages=find_packages(),
    python_requires='>=3.7',
    install_requires=[
        'pydantic>=2.5.1',
        'pydantic-settings==2.1.0',
    ],

)