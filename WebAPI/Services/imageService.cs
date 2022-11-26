using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace WebAPI.Services
{
    public class ImageService
    {
        private readonly IHostingEnvironment _hostEnvironment;

        public ImageService(
            IHostingEnvironment hostingEnvironment)
        {
            _hostEnvironment = hostingEnvironment;
        }

        public string uploadImage(IFormFile imageFile, string folder)
        {
            try
            {
                var pathToSave = _hostEnvironment.WebRootPath + "\\api\\Images\\" + folder + "\\";

                var fileName = imageFile.FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);

                using (FileStream fileStream = System.IO.File.Create(fullPath))
                {
                    imageFile.CopyTo(fileStream);
                    fileStream.Flush();
                    return "\\api\\Images\\" + folder + "\\" + fileName;
                }
            }
            catch (Exception ex)
            {
                return "Faild. File length: " + imageFile.Length;
            }
        }

        public string deleteFolder(string fileName)
        {
            Debug.WriteLine("fileName.Length: " + fileName.Length);
            var fileNamewithoutFileType = fileName.Substring(0, fileName.Length - 4);
            var filePathOriginal = _hostEnvironment.WebRootPath + "\\api\\Images\\original\\" + fileName;
            var filePathResized = _hostEnvironment.WebRootPath + "\\api\\Images\\resized\\" + fileNamewithoutFileType + "_resized.jpg";
            Debug.WriteLine("filePathResized: " + filePathResized);
            if ((System.IO.File.Exists(filePathOriginal)))
            {
                System.IO.File.Delete(filePathResized);
                System.IO.File.Delete(filePathOriginal);
            }

            return "Image deleted";
        }

        /**
         * https://stackoverflow.com/questions/1922040/how-to-resize-an-image-c-sharp
         */
        public IFormFile ResizeImage(IFormFile imageFile)
        {
            Image image = Image.FromStream(imageFile.OpenReadStream(), true, true);

            int resizedWidth = (int)Math.Floor(image.Width * 0.5);
            int resizedHeight = (int)Math.Floor(image.Height * 0.5);

            var destRect = new Rectangle(0, 0, resizedWidth, resizedHeight);
            var destImage = new Bitmap(resizedWidth, resizedHeight);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            // Convert to Bitmap to IFormFile
            var stream = new MemoryStream();

            destImage.Save(stream, ImageFormat.Jpeg);

            var fileNamewithoutFileType = imageFile.FileName.Substring(0, imageFile.FileName.Length - 4);
            IFormFile resizedImageFile = new FormFile(stream, 0, stream.ToArray().Length, "name", fileNamewithoutFileType + "_resized.jpg");
            return resizedImageFile;
        }

    }
}
