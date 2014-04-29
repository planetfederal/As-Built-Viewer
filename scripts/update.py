import os, sys, gdal

gdal.PushErrorHandler('CPLQuietErrorHandler')

home = 'D:\sfmta_images'

f = open('updatedocs.sql', 'w')
f.write('set scan off;\n')
for root, dirs, files in os.walk(home):
    for name in files:
        if os.path.splitext(name)[1].lower() == '.tif':
            input_file = os.path.join(root, name)
            dataset = gdal.Open(input_file)
            if not (dataset is None):
                sizex = dataset.RasterXSize
                sizey = dataset.RasterYSize
                path = input_file[len(home):-4].replace('\\', '/')
                sql = 'UPDATE DOCS SET WIDTH = ' + str(sizex) +', HEIGHT = ' + str(sizey) + ' WHERE PATH=\''+path+'\';'
                f.write(sql + '\n')
                dataset = None
				

f.write('COMMIT;')
