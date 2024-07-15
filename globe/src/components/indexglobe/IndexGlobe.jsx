import { useEffect, useRef, useState } from 'react'
import { Articlewindow } from '../articlewindow/Articlewindow.jsx'
import articles from '../../articles'
import Globe from 'react-globe.gl'
import * as THREE from 'three'
import Righteous_Regular from '../../assets/Righteous_Regular'
import './MyApp.css'
function Indexglobe() {
  const [articleWindowVisible, setArticleWindowVisible] = useState(false);
  const globeEl = useRef()
  const [pointTitle, setPointTitle] = useState('');
  const [isUserHovering, setIsUserHovering] = useState(false);
  const [count, setCount] = useState(0)
  const [globeVisible, setGlobeVisible] = useState(true);
  const [globeready, setglobeready] = useState(false);
  const [globeMaterialOptions, setGlobeMaterialOptions] = useState({
    color: 0x000000,  
    opacity: 0.3,     
    transparent: true, 
  });
  let cityData = [
    { lat: 31.5051, lng: -85, size: 0.5, color: "red", city: "Free software" },
    { lat: 28.6139, lng: 77.2088, size: 0.5, color: "red", city: "Copyright vs Copyleft" },
    { lat: 35.6895, lng: 139.6917, size: 0.5, color: "red", city: "Licences" },
    { lat: 13.9249, lng: 18.4244, size: 0.5, color: "red", city: "Kernel" }
  ]


  
  function handleObjectOver(obj) {
    setIsUserHovering(true);
  }
  
  function handleCloseArticle(e) {
    setArticleWindowVisible(false);
    globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2, size: 10 }, 3000);
  }

  function handleGlobeClick(obj) {
    globeEl.current.pointOfView({ lat: obj.lat, lng: obj.lng, altitude: 0.9, size: 10 }, 3000);
    setTimeout(() => {
      console.log('hello ', obj.title);
      setPointTitle(obj.text);
      setArticleWindowVisible(true);
      // globeEl.current.controls().autoRotate = false;
    }, 3000);
  }
  const globeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,  
    opacity: 0.3,     
    transparent: true, 
  });
  function handleAutoRotate() {
    console.log('autoRotate', globeEl.current.controls().autoRotate);
    globeEl.current.controls().autoRotate = !globeEl.current.controls().autoRotate;
  }
  function handleGlobeVisibility() {
    setGlobeVisible(!globeVisible);
  }

  const transparentPlaneGeometry = new THREE.PlaneGeometry(65, 30);
  const transparentPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000, 
    opacity: 0.001, 
    transparent: true, 
    depthWrite: false, 
  });
  
  function createTransparentPlane(lat, lng) {
    const transparentPlane = new THREE.Mesh(transparentPlaneGeometry, transparentPlaneMaterial);
    transparentPlane.position.set(lat, lng, 0.01); // Position slightly above label
    return transparentPlane;
  }
  const transparent_plane = createTransparentPlane(0, 0);

  return (
    <> 
       <div className="bg-animation">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
    </div>
      
      {articleWindowVisible ? <Articlewindow pointTitle={pointTitle} closeFn={handleCloseArticle} /> : null}
      <div id="buttonContainer">
        <button onClick={() => handleGlobeVisibility()}>toggle globe visibility</button>
        <button onClick={() => handleAutoRotate()}>toggle autoRotate</button>
      </div>
      <Globe
        ref={globeEl}
        showGlobe={globeVisible}
        waitForGlobeReady={true}
        objectsData={articles}
        objectLat={d=>d.lat}
        objectLng={d=>d.lng}
        objectFacesSurface
        objectThreeObject={(d) => createTransparentPlane(0, 0)}
        globeMaterial={globeMaterial}
        backgroundColor="rgba(0, 0, 0, 0)"
        
        onGlobeReady={
          () => {
            console.log('globe ready');
            setglobeready(true);
            globeEl.current.labelSize = "3.2"
            /*
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 1; 
            */
          }
        }

        objectAltitude={0}
        onObjectClick={(obj) => handleGlobeClick(obj)}
        labelsData={articles}
        labelTypeFace={Righteous_Regular}
        labelsTransitionDuration={0}
        labelSize={3.2}
        onLabelClick={(label) => handleGlobeClick(label)}
        showAtmosphere={false}
      />
    </>
  )
}

export default Indexglobe
