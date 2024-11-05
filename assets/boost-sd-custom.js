/*********************** Custom JS for Boost AI Search & Discovery  ************************/
// Search API before call on search results page & ISW
window.__BoostCustomization__ = (window.__BoostCustomization__ ?? []).concat((registry) => {
  registry.useModulePlugin('SearchAPI', {
    name: 'Customize search API',
    apply(builder) {

      builder.on('beforeMethodCall', 'searchInCollection', (payload) => {
        const filterParams = payload.args[0];
        let isApiFilterInSearchPage = false;
        if(!filterParams) return;
        
        const keys = Object.keys(filterParams);
        if(keys?.length > 0) {
          for(let i = 0; i < keys.length; i++) {
            if(keys[i].startsWith('pf_')) {
              isApiFilterInSearchPage = true;
              break;
            }
          }
        }
         // Logic runs before filtering in search results page, please only edit in TODO
        if(isApiFilterInSearchPage) {
          // TODO (example)
          if (payload) {
            const params = new URL(location.href).searchParams;
            const q = params.get('q') || '';
            payload.args[0].q = q;
          }
          // END TODO
        }
      });
    },
  });
});