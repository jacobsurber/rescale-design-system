import{u as t,j as e}from"./iframe-B1-uYr6Z.js";import{d as l}from"./styled-components.browser.esm-B2TGqWjS.js";const i=l.div`
  padding: var(--rescale-space-6);
  border-radius: var(--rescale-radius-lg);
  background-color: var(--rescale-color-light-blue);
  border: 1px solid var(--rescale-color-brand-blue);
`,n=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--rescale-space-4);
  margin-top: var(--rescale-space-4);
`,a=l.div`
  width: 100%;
  height: 40px;
  background-color: ${r=>r.color};
  border-radius: var(--rescale-radius-base);
  border: 1px solid var(--rescale-color-gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${r=>r.color==="#FFFFFF"?"var(--rescale-color-gray-900)":"var(--rescale-color-white)"};
  font-weight: var(--rescale-font-weight-medium);
  font-size: var(--rescale-font-size-sm);
`,c=()=>{const{tokens:r}=t();return e.jsxs(i,{children:[e.jsx("h3",{style:{margin:0,color:"var(--rescale-color-dark-blue)",fontFamily:"var(--rescale-font-family)"},children:"Rescale Theme Example"}),e.jsx("p",{style:{color:"var(--rescale-color-gray-700)",fontSize:"var(--rescale-font-size-sm)",margin:"var(--rescale-space-2) 0"},children:"This component demonstrates the useRescaleTheme hook and CSS variables."}),e.jsxs(n,{children:[e.jsxs("div",{children:[e.jsx("h4",{style:{fontSize:"var(--rescale-font-size-base)",margin:"0 0 var(--rescale-space-2) 0"},children:"Primary Colors"}),e.jsx(a,{color:r.colors.primary.brandBlue,children:"Brand Blue"}),e.jsx(a,{color:r.colors.primary.darkBlue,children:"Dark Blue"}),e.jsx(a,{color:r.colors.primary.skyBlue,children:"Sky Blue"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{fontSize:"var(--rescale-font-size-base)",margin:"0 0 var(--rescale-space-2) 0"},children:"Status Colors"}),e.jsx(a,{color:r.colors.status.success,children:"Success"}),e.jsx(a,{color:r.colors.status.warning,children:"Warning"}),e.jsx(a,{color:r.colors.status.error,children:"Error"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{fontSize:"var(--rescale-font-size-base)",margin:"0 0 var(--rescale-space-2) 0"},children:"Typography"}),e.jsxs("div",{style:{fontSize:"var(--rescale-font-size-sm)",color:"var(--rescale-color-gray-700)"},children:["Font Family: ",r.typography.fontFamily]}),e.jsxs("div",{style:{fontSize:"var(--rescale-font-size-sm)",color:"var(--rescale-color-gray-700)"},children:["Base Size: ",r.typography.fontSize.base,"px"]}),e.jsxs("div",{style:{fontSize:"var(--rescale-font-size-sm)",color:"var(--rescale-color-gray-700)"},children:["Border Radius: ",r.borderRadius.base,"px"]})]})]})]})};c.__docgenInfo={description:"",methods:[],displayName:"ThemeExample"};const p={title:"Atoms/ThemeExample",component:c,parameters:{layout:"padded",docs:{description:{component:"Example component demonstrating the useRescaleTheme hook and CSS variables usage."}}},tags:["autodocs"]},s={args:{}},o={render:()=>e.jsx("div",{style:{maxWidth:"800px",margin:"0 auto"},children:e.jsx(c,{})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: '800px',
    margin: '0 auto'
  }}>
      <ThemeExample />
    </div>
}`,...o.parameters?.docs?.source}}};const h=["Default","WithWrapper"];export{s as Default,o as WithWrapper,h as __namedExportsOrder,p as default};
