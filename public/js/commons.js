async function requestExternalImage(imageUrl) {
  const res = await fetch('fetch_external_image', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ imageUrl })
  })
  if (!(res.status < 400)) {
    console.error(res.status + ' : ' + await res.text())
    throw new Error('failed to fetch image from url: ' + imageUrl)
  }

  let blob
  try {
    blob = await res.blob()
    return await faceapi.bufferToImage(blob)
  } catch (e) {
    console.error('received blob:', blob)
    console.error('error:', e)
    throw new Error('failed to load image from url: ' + imageUrl)
  }
}

function renderNavBar(navbarId, exampleUri) {
  const examples = [
    {
      uri: 'webcam_face_detection',
      name: '👁️ Detección de rostro',
      icon: 'face'
    },
    {
      uri: 'webcam_face_landmark_detection',
      name: '🎯 Detección de puntos',
      icon: 'adjust'
    },
    {
      uri: 'webcam_face_expression_recognition',
      name: '😊 Reconocimiento de expresiones',
      icon: 'mood'
    },
    {
      uri: 'webcam_age_and_gender_recognition',
      name: '👶👵 Reconocimiento de edad y género',
      icon: 'person'
    }
  ]

  // Create main container
  const container = document.createElement('div')
  container.style.display = 'flex'
  container.style.minHeight = '100vh'
  container.style.width = '100%'

  // Create sidebar
  const sidebar = document.createElement('div')
  sidebar.style.width = '250px'
  sidebar.style.background = '#2c3e50'
  sidebar.style.padding = '20px 0'
  sidebar.style.boxShadow = '2px 0 5px rgba(0,0,0,0.1)'

  // Add app title
  const appTitle = document.createElement('div')
  appTitle.style.color = 'white'
  appTitle.style.fontSize = '1.5rem'
  appTitle.style.fontWeight = 'bold'
  appTitle.style.padding = '0 20px 20px 20px'
  appTitle.style.borderBottom = '1px solid rgba(255,255,255,0.1)'
  appTitle.style.marginBottom = '20px'
  appTitle.style.display = 'flex'
  appTitle.style.alignItems = 'center'
  appTitle.style.gap = '10px'
  appTitle.textContent = '👁️ Face Tracker'
  sidebar.appendChild(appTitle)

  // Create navigation list
  const navList = document.createElement('div')
  navList.style.display = 'flex'
  navList.style.flexDirection = 'column'
  navList.style.gap = '5px'
  navList.style.padding = '0 10px'

  // Add navigation items
  examples.forEach(ex => {
    const item = document.createElement('a')
    item.href = ex.uri
    item.style.display = 'flex'
    item.style.alignItems = 'center'
    item.style.padding = '12px 15px'
    item.style.color = 'white'
    item.style.textDecoration = 'none'
    item.style.borderRadius = '6px'
    item.style.transition = 'all 0.2s ease'
    item.style.gap = '12px'
    
    if (ex.uri === exampleUri) {
      item.style.background = 'rgba(255, 255, 255, 0.15)'
      item.style.fontWeight = '500'
    } else {
      item.style.opacity = '0.8'
      item.onmouseover = () => {
        item.style.background = 'rgba(255, 255, 255, 0.1)'
        item.style.opacity = '1'
      }
      item.onmouseout = () => {
        item.style.background = 'transparent'
        item.style.opacity = '0.8'
      }
    }

    // Add icon
    const icon = document.createElement('i')
    icon.className = 'material-icons'
    icon.textContent = ex.icon
    icon.style.fontSize = '20px'
    
    // Add text
    const text = document.createElement('span')
    text.textContent = ex.name
    text.style.fontSize = '0.95rem'
    
    item.appendChild(icon)
    item.appendChild(text)
    navList.appendChild(item)
  })

  sidebar.appendChild(navList)
  container.appendChild(sidebar)
  
  // Create content area
  const content = document.createElement('div')
  content.style.flex = '1'
  content.style.padding = '20px'
  content.id = 'content-area'
  
  // Add existing content to the content area
  const existingContent = document.querySelector('.page-container')
  if (existingContent) {
    content.appendChild(existingContent)
  }
  
  container.appendChild(content)
  
  // Clear the body and add our new structure
  document.body.innerHTML = ''
  document.body.style.margin = '0'
  document.body.style.padding = '0'
  document.body.style.fontFamily = '"Segoe UI", Roboto, sans-serif'
  document.body.appendChild(container)
}

function renderSelectList(selectListId, onChange, initialValue, renderChildren) {
  const select = document.createElement('select')
  $(selectListId).get(0).appendChild(select)
  renderChildren(select)
  $(select).val(initialValue)
  $(select).on('change', (e) => onChange(e.target.value))
  $(select).material_select()
}

function renderOption(parent, text, value) {
  const option = document.createElement('option')
  option.innerHTML = text
  option.value = value
  parent.appendChild(option)
}