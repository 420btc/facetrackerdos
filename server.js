const express = require('express')
const path = require('path')
const { get } = require('request')

const app = express()

// Configuración para Vercel
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas estáticas
const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'weights')))
app.use(express.static(path.join(__dirname, 'dist')))

// Ruta por defecto
app.get('/', (req, res) => res.redirect('/webcam_face_detection'))

// Rutas de la aplicación
app.get('/webcam_face_detection', (req, res) => {
  res.sendFile(path.join(viewsDir, 'webcamFaceDetection.html'))
})

app.get('/webcam_face_landmark_detection', (req, res) => {
  res.sendFile(path.join(viewsDir, 'webcamFaceLandmarkDetection.html'))
})

app.get('/webcam_face_expression_recognition', (req, res) => {
  res.sendFile(path.join(viewsDir, 'webcamFaceExpressionRecognition.html'))
})

app.get('/webcam_age_and_gender_recognition', (req, res) => {
  res.sendFile(path.join(viewsDir, 'webcamAgeAndGenderRecognition.html'))
})

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Manejo de errores
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  server.close(() => process.exit(1))
})

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}