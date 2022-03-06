### Vue3 component render
### component mount flow
* createApp: generate application instance
* mount: mount component
  * create virtual node with root component and root props
  * render virtual to real node
* patch: patch element, component
  * mount root component
  * create component instance
  * setup component: 
    * execute setup method and get it return value to setup result
    * to make user access property more convenient, so employ proxy to proxy result
      * unref setup state
    * assign setup state to component instance
  * setupRenderEffect, when reactive data update will trigger it again
     * execute render and specify `this` is setupState
    
### component update flow
* update reactive state in setup
