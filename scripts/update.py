import sys; sys.path.insert(0,'/Library/Frameworks/GDAL.framework/Versions/1.8/Python/site-packages')

from osgeo import gdal
import os, sys

gdal.PushErrorHandler('CPLQuietErrorHandler')

home = '/Users/bartvde/opengeo/projects/asbuilt/sfmta_images/'

print 'set scan off;'
for root, dirs, files in os.walk(home):
    for name in files:
        if os.path.splitext(name)[1] == '.TIF':
            input_file = os.path.join(root, name)
            dataset = gdal.Open(input_file)
            if not (dataset is None):
                sizex = dataset.RasterXSize
                sizey = dataset.RasterYSize
                path = '/' + input_file[len(home):-4]
                sql = 'UPDATE DOCS SET WIDTH = ' + str(sizex) +', HEIGHT = ' + str(sizey) + ' WHERE PATH=\''+path+'\';'
                print sql

print 'COMMIT;'
