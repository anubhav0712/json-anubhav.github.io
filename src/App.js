import './App.css';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import 'antd/dist/antd.css';
import { linter } from '@codemirror/lint'
import { useState } from 'react';
import { Col, Row } from 'antd';
import { Layout} from 'antd';

const { Header, Content, Footer } = Layout;


function App() {
  

  const linterExtension = linter(jsonParseLinter())
  const initialValue = { "fruits": ["apple", "banana"]}

  function convertObjectToString(obj){
    return JSON.stringify(obj, null ,'\t');
  }

  function convertObjectToMinString(obj){
    return JSON.stringify(obj);
  }

  function convertStringToObject(str){
    return JSON.parse(str);
  }

  const [state, setState] = useState(convertObjectToString(initialValue));
  const [currentState, setCurrentState] = useState(convertObjectToString(initialValue));
  const [isCopied, setIsCopied] = useState(false);
  const editorColor = '#282c34';
  function updateState(){
    try{
      const obj = convertStringToObject(currentState);
      const jsonStr = convertObjectToString(obj);
      setState(jsonStr);
    }
    catch(e){
      console.log("JSON parsing error", e);
    }
    
  }

  function updateStateToMinified(){
    try{
      const obj = convertStringToObject(currentState);
      const jsonStr = convertObjectToMinString(obj);
      setState(jsonStr);
    }
    catch(e){
      console.log("JSON parsing error", e);
    }
    
  }

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(state)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (

    <Layout>
      <Header style={{background: '#f0f2f5'}}>
      <h2>JSON Formatter</h2>
    </Header>
    <Content style={{ padding: '2px 50px' }}>
     <Row >
       <Col span={21}>
       <CodeMirror
      value={state}
      height="600px"
      width='100%'
      theme={oneDark}
      maxHeight="600px"
      extensions={[json(), linterExtension]}
      onChange={(value, viewUpdate) => {
        setCurrentState(value);
      }}
    />
       </Col>
       <Col span={3} style={{background: editorColor}}>
       <Row style={{ marginTop: '5px'}}>
         <button onClick={handleCopyClick} className="button-50" style={{margin: '5px'}}>
         <span>{isCopied ? 'Copied!' : 'Copy'}</span>
           </button>
         </Row>
         <Row style={{ marginTop: '5px'}}>
         <button onClick={updateState} className="button-50" style={{margin: '5px'}}>
           Format
           </button>
         </Row>
         <Row style={{ marginTop: '5px'}}>
         <button onClick={updateStateToMinified} className="button-50" style={{margin: '5px'}}>
           Minify   
           </button>
         </Row>
       </Col>
     </Row>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Created in hurry!</Footer>
    </Layout>
  );
  
}

export default App;
