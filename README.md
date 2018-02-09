# frontend-conversiontracking

Set of front-end javascript tools to handle Online Activity conversion tracking. 

## Prelander usage
When using a prelander hosted on a different domainname; you need to pass tracking variables to the landingpage. This modifies links and forms to include variables. 

*When using redirects (for ex: javascript) other than links or forms, you'll need to manually append the click-id variables*

    <script async 
		src="https://cdn.jsdelivr.net/npm/oa-frontend-conversiontracking@1/dist/prelander.min.js"
		data-params="oa_clickid,subid2">
	</script>

### Options
| Name | Default | Description |
|--|--| -- |
| data-params | oa_clickid | comma seperated variable names to add to links and forms  |
|data-link-selector | a[href], area[href] | selector for links (with href attribute) |
| data-form-selector | form |selector for forms, variables added to action or hidden input fields |





