import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Pages/Home';
import ProductGenerator from './Pages/ProductGenerator';
import ProductCrawler from './Pages/ProductCrawler';
import Error from './Pages/Error';

const App = () => {

  return (
    <>
      <BrowserRouter>
        {
            <Routes>
              <Route path='/home'
                element={
                  <Home />
                }
              />

              <Route path='/product-generator'
                element={
                  <ProductGenerator />
                }
              />

              <Route path='/product-crawler'
                element={
                  <ProductCrawler />
                }
              />

              <Route path='/*'
                element={
                  <Error />
                }
              />
            </Routes>
        }
      </BrowserRouter>
    </>
  )
}

export default App;