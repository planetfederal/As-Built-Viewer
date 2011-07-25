<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
 xmlns="http://www.opengis.net/sld"
 xmlns:ogc="http://www.opengis.net/ogc"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>Warped</Name>
    <UserStyle>
      <Title>Warping</Title>
      <Abstract>A sample style that draws a line</Abstract>
      <FeatureTypeStyle>
        <Transformation>
          <ogc:Function name="gs:GeorectifyCoverage">
            <ogc:Function name="parameter">
              <ogc:Literal>data</ogc:Literal>
            </ogc:Function>
            <ogc:Function name="parameter">
              <ogc:Literal>gcp</ogc:Literal>
              <ogc:Function name="env"><ogc:Literal>gcp</ogc:Literal></ogc:Function>
            </ogc:Function>
            <ogc:Function name="parameter">
              <ogc:Literal>bbox</ogc:Literal>
              <ogc:Function name="env"><ogc:Literal>wms_bbox</ogc:Literal></ogc:Function>
            </ogc:Function>
            <ogc:Function name="parameter">
              <ogc:Literal>targetCRS</ogc:Literal>
              <ogc:Function name="env"><ogc:Literal>wms_crs</ogc:Literal></ogc:Function>
            </ogc:Function>
            <ogc:Function name="parameter">
              <ogc:Literal>width</ogc:Literal>
              <ogc:Function name="env"><ogc:Literal>wms_width</ogc:Literal></ogc:Function>
            </ogc:Function>
            <ogc:Function name="parameter">
              <ogc:Literal>height</ogc:Literal>
              <ogc:Function name="env"><ogc:Literal>wms_height</ogc:Literal></ogc:Function>
            </ogc:Function>
          </ogc:Function>
        </Transformation>
        <Rule>
          <RasterSymbolizer>
            <Opacity>1.0</Opacity>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>