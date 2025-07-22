import{j as r}from"./iframe-B1-uYr6Z.js";import{B as e,S as a}from"./Button-CkWAHMFb.js";import"./styled-components.browser.esm-B2TGqWjS.js";const p={title:"Atoms/Button",component:e,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["primary","secondary","ghost","text"]},size:{control:{type:"select"},options:["small","middle","large"]},disabled:{control:{type:"boolean"}},loading:{control:{type:"boolean"}}}},t={args:{children:"Primary Button",variant:"primary"}},n={args:{children:"Secondary Button",variant:"secondary"}},s={args:{children:"Ghost Button",variant:"ghost"}},o={args:{children:"Text Button",variant:"text"}},i={render:()=>r.jsxs(a,{children:[r.jsx(e,{variant:"primary",children:"Primary"}),r.jsx(e,{variant:"secondary",children:"Secondary"}),r.jsx(e,{variant:"ghost",children:"Ghost"}),r.jsx(e,{variant:"text",children:"Text"})]})},c={render:()=>r.jsxs(a,{children:[r.jsx(e,{size:"small",children:"Small"}),r.jsx(e,{size:"middle",children:"Medium"}),r.jsx(e,{size:"large",children:"Large"})]})},d={render:()=>r.jsxs(a,{direction:"vertical",children:[r.jsxs(a,{children:[r.jsx(e,{children:"Default"}),r.jsx(e,{loading:!0,children:"Loading"}),r.jsx(e,{disabled:!0,children:"Disabled"})]}),r.jsxs(a,{children:[r.jsx(e,{variant:"secondary",children:"Default"}),r.jsx(e,{variant:"secondary",loading:!0,children:"Loading"}),r.jsx(e,{variant:"secondary",disabled:!0,children:"Disabled"})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Primary Button',
    variant: 'primary'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Secondary Button',
    variant: 'secondary'
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Ghost Button',
    variant: 'ghost'
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Text Button',
    variant: 'text'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Space>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="text">Text</Button>
    </Space>
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Space>
      <Button size="small">Small</Button>
      <Button size="middle">Medium</Button>
      <Button size="large">Large</Button>
    </Space>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Space direction="vertical">
      <Space>
        <Button>Default</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </Space>
      <Space>
        <Button variant="secondary">Default</Button>
        <Button variant="secondary" loading>Loading</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </Space>
    </Space>
}`,...d.parameters?.docs?.source}}};const h=["Primary","Secondary","Ghost","Text","AllVariants","Sizes","States"];export{i as AllVariants,s as Ghost,t as Primary,n as Secondary,c as Sizes,d as States,o as Text,h as __namedExportsOrder,p as default};
