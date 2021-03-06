if(typeof Vue!=='undefined'){
      //window.eventBus = new Vue({});

      //var lux = $.Lux;


      function findWindow() {
        return window.frames[0];
      }


      //console.log( lux.fx );

      Vue.use(Vuex);

      let iv;
      let dashboardApp;
      let mapGetters = Vuex.mapGetters; //[]
      let mapActions = Vuex.mapActions; //[]


      let palettes = [
        {
          family : "new",
          active : false,
          enabled : false,
          colors : [],
        },
        {
          family   : "Plain",
          active : false,
          enabled : true,
          colors : [
           { hex : 'CC0000', name : 'Boston Red' },
           { hex : 'F2951B', name : 'Orange' },
           { hex : 'FCCC00', name : 'Yellowish' },
           { hex : '03C03C', name : 'Dark Green' },
           { hex : '007FFF', name : 'Azure' },
           { hex : 'C41BF2', name : 'Purple' },
           { hex : '333333', name : 'Charcoal' }
          ]
        },

        {
          family : "Rainbow",
          active : false,
          enabled : true,
          colors: [
            { hex : 'F964CB', name : 'Sand Pink'   },
            { hex : 'FA6563', name : 'Sand Red'    },
            { hex : 'FFA64D', name : 'Sand Orange' },
            { hex : 'FFE056', name : 'Sand Yellow' },
            { hex : '94DA87', name : 'Sand Green'  },
            { hex : '75B8FB', name : 'Late Sky'    },
            { hex : '3399FF', name : 'Electric'    },
            { hex : '6868DC', name : 'Dusk'        },
            { hex : '404058', name : 'Twilight'    },
            { hex : '1C1D24', name : 'Dark Night'  },
            { hex : 'A9A9A9', name : 'Grey Bee'    },
            { hex : 'e0e0e0', name : 'Cloudy'      }
          ]
        },

        {
          family   : "Architect",
          active : true,
          enabled : true,
          colors: [
           { hex : 'CBEAF3', name : 'Arch 1' },
           { hex : '94d8Ed', name : 'Arch 2' },
           { hex : '55BCED', name : 'Arch 3' },
           { hex : '28A9E1', name : 'Arch 4' },
           { hex : '147bbc', name : 'Arch 6' },
           { hex : '0a6ba8', name : 'Arch 7' },
           { hex : 'ddbb85', name : 'Accent' }
          ]
        },

        {
          family   : "Sad Clouds",
          active : false,
          enabled : true,
          colors: [
           { hex : 'f8f9fa', name : 'Grey 2' },
           { hex : 'e8e8e8', name : 'Puff' },
           { hex : 'e9ecef', name : 'Grey 1' },
           { hex : 'e0e0e0', name : 'Cloud' },
           { hex : 'dee2e6', name : 'Grey 3' },
           { hex : 'b5b5b5', name : 'Puff 2' },
           { hex : 'A9A9A9', name : 'Grey Bee' },
           { hex : '576879', name : 'Sad Cloud' }

          ]
        }

      ];

      let ap = localStorage.getItem('lux_activePage');
          ap = ap ? 'test/' + ap : false;

      //weird boolean casting problem
      let dd = localStorage.getItem('lux_display');
          dd = typeof dd != 'undefined' && dd === 'true' ? true : false;

          console.warn('display dash',dd,(typeof dd));

      function initStore(fx){


        let initState = {
          remote   : null,
          display  : dd,
          sheets   : [],
          pages    : [],
          palettes : palettes,
          vars     : [],
          activePage     : null,
          activePalette  : null,
          expandSheets   : false,
          expandPages    : false,
          expandPalettes : false,
          viewerSrc : ap || 'test/layout-standard.html'
        };


        //console.info("Reloading VueX State");

        const state = Vue.util.extend({}, initState);
        const getters = {}

        const mutations = {
          RESET_STATE : (state)=>{
            const reset = Vue.util.extend({}, initState);
            for( let f in state ){
              Vue.set(state, f, reset[f]);
            }
          },
          LOAD_APP : (state, remote)=>{

          },
          LOAD_VIEWER : (state, payload)=>{

          },
          LOAD_SHEETS : (state, sheets)=>{
            state.sheets = sheets;
            //console.log(sheets.map( sheets => sheets.name ));
          },
          LOAD_PAGES : (state, pages)=>{
            let activePage = fx.store_load('activePage');
            state.pages = pages;
            state.activePage = activePage;

            if( activePage && state.viewerSrc != state.activePage  ){
              state.viewerSrc = 'test/' + activePage;
              //console.log("UPDATING VIEWSRC via LOAD_PAGES",activePage)
            }
            //$store.dispatch('activatePage',page)
          },
          LOAD_CHILD : (state, remote)=>{
            state.remote = remote;
            state.expandPages = false;
            state.expandSheets = false;
            //console.log('vuex load child mutation');
          },

          TOGGLE_SHEET : (state, name, show) => {
            let remoteLux = state.remote.$.Lux;
            if( remoteLux ){
              let stat = remoteLux.fx.toggleSheet(name);
              const sheet = state.sheets.find( sheet => sheet.name === name );
              if( sheet ){
                sheet.active = !stat;
                //console.log(sheet.active);
              }
            }else{
              console.warn("missing remoteLux", state.remote, state.remote.$.Lux);
            }
          },

          LOAD_SHEET : (state, name, sheet ) => {

            const localsheet = state.sheets.find( sheet => sheet.name === name );

            if(!localsheet){
              state.sheets.push( sheet );
            }else{
              //todo
            }

            console.info(state, payload)
          },
          LOAD_PALETTES: (state, payload) => {
            console.info(state, payload)
          },
          LOAD_PALETTE: (state, payload) => {
            console.info(state, payload)
          },
          SET_DISPLAY: (state, show) => {
            state.display = show;
            console.log('set show dashboard?',state.display, show);
            localStorage.setItem('lux_display',show);

          },
          UNLOAD_SHEET : (state, payload) => {
            console.info(state, payload)
          },
          TOGGLE_DISPLAY : (state) => {
            state.display = !state.display;
            console.log('toggle dashboard?',state.display);
            localStorage.setItem('lux_display',state.display);
          },
          TOGGLE_SHEETS : (state, show) => {
            state.expandSheets = !state.expandSheets;
          },
          TOGGLE_PAGES : (state, show) => {
            state.expandPages = !state.expandPages;
          },
          TOGGLE_PALETTES : (state, show) => {
            state.expandPalettes = !state.expandPalettes;
          },
          ACTIVATE_PALETTE : (state, {idx,family}) => {
            const palettes = state.palettes;
            palettes.map( palette => palette.active = false );
            palettes[idx].active = true;
            state.activePalette = family;
            //console.log('activated palette', family);
          },
          ACTIVATE_PAGE : (state, page) => {
            state.activePage = page;
            if( page && state.viewerSrc != state.activePage  ){
              state.viewerSrc = 'test/' + page;
              //console.log("UPDATING VIEWSRC via ACTIVATEPAGE",page)
            }
            //console.log('ACTIVATE PAGE ACTION 2');
          },
          JUMP_PAGE : (state, page) => {
            state.activePage = page;
          },
          SET_VIEWER_SRC : (state, src) => {
            state.viewerSrc = src;
          }
         };

        const actions = {
          resetState: (context, payload) => {
            context.commit('RESET_STATE', payload);
          },
          loadApp: (context, payload) => {
            context.commit('LOAD_APP', payload);
          },

          loadChild: (context, remote) =>{
            context.commit('LOAD_CHILD', remote);
          },

          loadSheets: (context, sheets) => {
            context.commit('LOAD_SHEETS', sheets);
          },

          loadPages: (context, pages) => {
            context.commit('LOAD_PAGES', pages);
          },
          loadPalettes: (context, palettes) => {
            context.commit('LOAD_PALETTES', palettes);
          },
          toggleSheet: (context, payload) => {
            context.commit('TOGGLE_SHEET', payload);
          },
          loadSheet: (context, payload) => {
            context.commit('LOAD_SHEET', payload);
          },
          unloadSheet: (context, payload) => {
            context.commit('UNLOAD_SHEET', payload);
          },
          toggleDisplay : (context) => {
            context.commit('TOGGLE_DISPLAY');
          },
          setDisplay : (context,payload) => {
            context.commit('SET_DISPLAY', payload);
          },
          expandSheets : (context, payload) => {
            context.commit('TOGGLE_SHEETS', payload);
          },
          expandPages : (context, payload) => {
            context.commit('TOGGLE_PAGES', payload);
          },
          expandPalettes : (context, payload) => {
            context.commit('TOGGLE_PALETTES', payload);
          },
          activatePalette : (context, payload ) => {
           context.commit('ACTIVATE_PALETTE', payload);
          },
          activatePage : (context, payload ) => {
            //console.log('ACTIVATE PAGE ACTION');
            context.commit('ACTIVATE_PAGE', payload);
          },
          jumpPage : (context, page) => {
            const remote = context.state.remote;
            //console.log('JUMPING PAGE',page);
            if( page ){
              let url = 'test/' + page;
              remote.location  = url;
            }

            context.commit('JUMP_PAGE', page);
          },
          setViewerSrc : (context, payload ) => {
            context.commit('SET_VIEWER_SRC', payload);
          }
       };

        const store = new Vuex.Store({
           state,
           mutations,
           actions,
           getters:getters
        });

        return store;
      }




      function loadApp( fx ){

          console.info('childready event');

          const store = initStore(fx);

          const EventBus = new Vue();
          Object.defineProperties( Vue.prototype, {
            $bus: {
              get: function () {
                return EventBus
              }
            }
          });

          Vue.directive('focus', {
            inserted: function (el) {
             //console.log('ins', el)
             el.focus();
            }
          });


          const palettesModule = Vue.component('palettes', {
            template : `
              <div id='palettes' class='mini' >
                <a class='field-style' @click='expandPalettes = !expandPalettes'>
                  {{activePalette || 'Palettes' }}
                  <em class='badge' :data-badge='palettes.length'>{{palettes.length}}</em>
                </a>
                <template>
                  <ul v-bind:class="{ _expand : expandPalettes }" >
                    <template v-for="(palette,index) in palettes" >
                      <palette @activate='activatePal' :init-family='palette.family' :key="palette.id" ></palette>
                    </template>
                  </ul>
                </template>
              </div>
            `,
            props    : ['initActive'],
            computed: {
              palettes: {
                get : function(){ return this.$store.state.palettes.filter( palette => palette.enabled === true ); },
                set : function(palettes){ this.$store.dispatch('loadPalettes', palettes); }
              },
              expandPalettes : {
                get : function(){ return this.$store.state.expandPalettes; },
                set : function(){ this.$store.dispatch('expandPalettes'); }
              },
              activePalette : {
                get : function(){ return this.$store.state.activePalette; },
                set : function(family){
                  this.activatePal(family);
                }
              }
            },
            methods:{
              activatePal: function(family){

                //console.log('activate');

                const idx = this.$store.state.palettes.findIndex( palette => palette.family === family );
                //console.log( 'activate', family, idx );

                if( idx >= 0 ){
                  this.$store.dispatch('activatePalette',{idx,family});
                }else{
                  console.warn('cant find family', family);
                }

                this.expandPalettes = false;
              }
            }
          });

          const paletteModule = Vue.component('palette', {
            template : `
              <li class='palette' :id='family' @click.stop="$emit('activate',family)" >
                <label >{{family}} &#x1f517;</label>
                <div class='colors' >
                  <color v-for="c in colors" :init-hex='c.hex' :init-name='c.name' :key="c.id"></color>
                  <div class='cursor'></div>
                </div>
              </li>
            `,
            props    : ['initFamily'],
            data     : function(){
              return {
                  family : this.initFamily,
                  colors : palettes.find( palette => palette.family === this.initFamily ).colors
              };
            },
            computed:{
              palette: {
                get : function(){
                  const palette = this.$store.state.palettes.find( palette => palette.family === this.family );
                  return palette;
                },
                set : function(palette){
                  this.$store.dispatch('loadPalette', palette);
                }
              }
            },
            methods : {

              over : function(e){
                this.$el.style.border = "1px dashed lightblue";
                e.preventDefault();
                let item = e.target.closest('.swatch');

                if( e.target.classList.contains('swatch') ){
                  item = e.target
                }

                let cursor = this.$el.querySelector('.cursor');

                if( item ) item.insertAdjacentElement('beforebegin', cursor );
                //console.log(this,item,cursor);

              },

              clear : function(e){
                this.$el.style.border = "";
                console.log('exit');
              }
            }
          });

          const colorModule = Vue.component('color', {
            template : `
              <div :id='"col_" + _uid' class='swatch'  :title='name' >
                <i v-bind:style="{ backgroundColor:'#'+hex }"  >&nbsp;</i>
                <template v-if="!this.toggled">
                  <var @click='edit'>#{{hex}}</var>
                </template>
                <template v-else>
                  <input :style="{ outlineColor:'#'+hex }" typ='text' v-model="hex" v-focus @blur='update' @keyup.enter='update' />
                </template>
                <em>{{name}}</em>
              </div>
            `,
            props    : [ 'initHex','initName' ],
            data     : function(){
              return {
                hex  : this.initHex.toUpperCase() || 'CCCCCC' ,
                name : this.initName || 'Unknown',
                toggled : false
              };
            },
            methods : {
              update : function(e){
                console.log( 'blurred', this.hex );
                this.hex.toUpperCase();
                this.toggled = false;
              },
              edit : function(e){
                console.log( 'edit', this.hex, e );
                this.toggled = true;
                //this.$refs.search.focus();
              }
            }
          });



          const pagesModule = Vue.component('pages', {
            template : `
              <div id='pages' >
                <a class='field-style' @click='expandPages = !expandPages'>
                  {{ activePage || 'Pages' }}
                  <em class='badge' :data-badge='pages.length'>{{pages.length}}</em>
                </a>
                <template>
                  <ul v-bind:class="{ _expand : expandPages }">
                    <template v-for="(page,index) in pages" >
                      <page
                        @activate='activatePage'
                        :init-page='page'
                        :key="page.id"></page>
                    </template>
                  </ul>
                </template>
              </div>
            `,
            computed: {
              pages(){
                return this.$store.state.pages;
              },
              expandPages : {
                get : function(){ return this.$store.state.expandPages },
                set : function(){ this.$store.dispatch('expandPages') }
              },
              activePage :{
                get : function(){
                  //console.log('PAGE GET',this.$store.state.activePage );
                  return this.$store.state.activePage
                },
                set : function(page){
                  //console.log('PAGE SET',page );
                  this.$store.dispatch('activatePage',page);
                }
              }
            },
            methods : {
              activatePage: function(page){
                fx.store_save('activePage',page);
                this.$store.dispatch('activatePage',page);
              }
            }
          });

          const pageModule = Vue.component('page', {
            template : `
              <li class='field-style' @click="$emit('activate',name)" >
                <label>{{name}} &#x1f517;</label>
              </li>
            `,
            props    : [ 'initPage' ],
            data     : function(){
              return {
                name   : this.initPage   || 'Unknown',
              };
            },
            methods : {
              jump : function(e){
                this.$store.dispatch('jumpPage', this.name );
              }
            }
          });


          const sheetsModule = Vue.component('stylesheets', {
            template : `
              <div id='sheets' >
                <a class='field-style' @click='expandSheets = !expandSheets'>
                  Styles
                  <em class='badge' :data-badge='sheets.length'>{{sheets.length}}</em>
                </a>
                <template>
                  <ul v-bind:class="{ _expand : expandSheets }">
                    <template v-for="(sheet,index) in sheets" >
                      <stylesheet
                        :sheet='sheet'
                        :init-name='sheet.name'
                        :init-active='sheet.active'
                        :init-index='index'
                        :init-file='sheet.file'
                        :init-locked='sheet.locked'
                        :init-loaded='sheet.loaded'
                        :key="sheet.id+index">
                      </stylesheet>
                    </template>
                  </ul>
                </template>
              </div>
            `,
            computed: {
              sheets: {
                get : function(){ return this.$store.state.sheets; },
                set : function(sheets){ this.$store.dispatch('setSheets', sheets); }
              },
              expandSheets : {
                get : function(){ return this.$store.state.expandSheets; },
                set : function(){ this.$store.dispatch('expandSheets'); }
              }
            },
            methods : {

            }
          });


          const sheetModule = Vue.component('stylesheet', {
            template : `
              <li v-if="!locked && loaded" :sheet='sheet' class='field-style' v-on="{ click: !locked ? toggle : false }" >
                <input type='checkbox' :id='index' :checked='active' />
                <label>{{name}} &#x1f517;</label>
              </li>
              <li class='field-style unloaded' :sheet='sheet' v-else>
                <label>{{name}} &#x1f517;</label>
              </li>
            `,
            props    : [ 'initIndex','initName','initActive','initFile','initLocked','initLoaded' ],
            data     : function(){
              return {
                index  : this.initIndex,
                name   : this.initName   || 'Unknown',
                file   : this.initFile   || 'xxx',
                ref    : this.initRef    || null,
                locked : this.initLocked || false,
                loaded : this.initLoaded || false
              };
            },
            computed: {
              active : {
                get(){
                  const sheet = this.$store.state.sheets.find( sheet => sheet.name === this.name );
                  return sheet && sheet.active || false;
                },
                set(){ this.$store.dispatch('toggleSheet', this.name); }
              },
              sheet: {
                get : function(){
                  const sheet = this.$store.state.sheets.find( sheet => sheet.name === this.name );
                  return sheet;
                },
                set : function(sheet){
                  this.$store.dispatch('loadSheet', sheet);
                }
              },
            },
            methods : {
              toggle : function(e){
                this.$store.dispatch('toggleSheet', this.name );
              }

            }
          });


          const dashboardModule = Vue.component('dashboard', {
            template : `
              <section v-if="display" >
                <div class='luxlogo' @click='toggle'></div>
                <fieldset>
                  <legend>Dashboard (F2)</legend>
                  <pages></pages>
                  <stylesheets></stylesheets>
                  <palettes init-active='architect'>
                  </palettes>
                </fieldset>
              </section>
              <section v-else>
                <div class='luxlogo' @click='toggle'></div>
              </section>
            `,
            computed: {
              display: {
                get : function(){ return this.$store.state.display; },
                set : function(e){ console.log('SETTING DISPLAY',e); this.$store.dispatch('setDisplay',e); }
              }
            },


            created(){
              //console.info("dashboard created");

            },
            mounted: function(e) {

              let self = this;

              // let showDash = lux.fx.store_load('display');
              this.display = dd;

              //console.log('MOUNTING DISPLAY',this.display,dd );

              document.body.addEventListener('keydown', function(e) {
                //console.log( e.keyCode );
                if( e.keyCode == 113 ){
                  //self.hidden = !self.hidden;
                  //toggleDashboard();
                  self.$store.dispatch('toggleDisplay');
                }
              });
            },
            methods : {
              toggle : function(e){
                this.$store.dispatch('toggleDisplay' );
              }
            }
          });

          const dashboardViewer = Vue.component('viewer', {
            template : `
              <iframe name='viewer' id='viewer' :src='viewerSrc' v-on:load="loadLocal" v-on:error='localError'  >
              </iframe>
            `,
            computed: {
              viewerSrc: {
                get : function(){ return this.$store.state.viewerSrc; },
                set : function(src){ this.$store.dispatch('setViewerSrc', src ); }
              },
            },
            mounted: function(e) {
              //console.log('viewer mounted');
              let self = this;

              this.$nextTick(()=>{
                // Code that will run only after the
                // entire view has been rendered
                //console.log('nextick viewer mounted');
                self.$store.dispatch('loadChild');
              })

            },
            methods:{
              // newFrame(e){
              //   var iframe = findWindow(e.currentTarget);
              //   console.log(e.currentTarget, iframe);
              // },
              localError(){
                console.warn("OMG AN ERROR");
              },
              loadLocal(e){

                //console.log("xFrame 0 State", window.frames[0].document.readyState, e);
                //alert("Iframe is now loaded.");

                var iframe = findWindow(e.currentTarget);
                iframe.onerror=function(e){
                  console.warn("ERROR!!");
                }

                //console.log(iframe['name'],iframe);

                //recover broken url saved in localstorage
                if( !iframe['name'] || iframe['name'] === 'viewer' ){
                  setTimeout(()=>{
                    localStorage.removeItem('lux_activePage');
                    ap = 'test/layout-standard.html';
                    this.viewerSrc=ap;
                    console.warn('IFRAME Error',ap);
                  },1000);
                }

                this.$nextTick(()=>{

                  //this.$store.dispatch('resetState');
                  //this.$store.replaceState(initState);
                  //this.$forceUpdate();

                  setTimeout(()=>{
                    let remoteWindow = findWindow();

                    //console.info('trying remote', remoteWindow, remoteWindow.$.Lux);

                    if( remoteWindow.$ && remoteWindow.$.Lux ){

                      remoteLux = remoteWindow.$.Lux;

                      csslist   = window.css_list || [];
                      sheets    = remoteLux.fx.get(csslist); //using sheets fx

                      this.$store.dispatch('loadChild',remoteWindow);
                      this.$store.dispatch('loadSheets',sheets);
                      this.$store.dispatch('loadPages',window.html_list);
                      //console.log(sheets);
                      this.$forceUpdate();

                    }else{
                      console.error('Cant load sheets, invalid remote', remoteWindow );
                    }
                  },0);

                });
              },
            }
          });

          //ties components to rendered tags
          dashboardApp = new Vue({
            el : '#app',
            store,
            created(){
              //console.info("dashboard created");
            }
          });


          const toggleDashboard = () =>{
            store.dispatch('toggleDisplay');
          }


          window.toggleDashboard = $.Lux.toggleDashboard = toggleDashboard;

          //console.log( dashboardApp );
          //$(document).off('childready');

      }




      $(document).on('childready', (e)=>{
        console.log(`Window <${window.name}> sees you CHILD`);
        let remoteWindow = findWindow();
        //console.log(remoteWindow.document);

        setTimeout( ()=>{
          console.warn("sending message to child...");
          remoteWindow.$(remoteWindow.document).trigger('parentmessage');
        },1000);

      });

      $(document).on('childerror', (e)=>{
        console.warn(' ERROR CHILD! ');
      });

      if($.Lux.fx){

        $( function(){
          loadApp($.Lux.fx);
        });

        console.log('ready!');

      }else{
        console.error('Lux FX hasnt loaded yet!');
      }

//this.display = dd;

      window.onerror = (e)=> {
        console.error("Page Error!",e);
      }

      //let child = findWindow()
      // let iv2 = setTimeout( ()=>{
      //   console.log("MAIN Frame 0 State", window.frames[0].document.readyState);
      // },200);
}else{
  console.warn("Dashboard loaded but the context seems invalid!");
}
