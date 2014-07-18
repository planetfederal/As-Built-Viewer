# Ready GXP

The intention of this project is to provide a simple reusable template for 
GeoExt applications bound for a servlet container.

## Setup

    curl https://github.com/opengeo/readygxp/raw/master/readygxp.sh | sh -s myapp

Enhancements to come later.  For now, an application can be run as follows:

## Debug Mode

Loads all scripts uncompressed.

    ant init
    ant debug

This will give you an application available at http://localhost:8080/ by
default.  You only need to run `ant init` once (or any time dependencies
change).

## Prepare App for Deployment

To create a servlet run the following:

    ant

The servlet will be assembled in the build directory.

## SQL View for notes search
For notes search, the following SQL View named DOCS_NOTES_SEARCH needs to be set up in GeoServer

    select * from docs where '%text%' = 'empty' or doc_id in (select doc_id from docs_notes where note like '%%text%%')

The SQL param is named text and its default value is empty.
DOC_ID should be marked as identifier.
