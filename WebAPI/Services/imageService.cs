using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using WebAPI.Entities;
using WebAPI.Models;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace WebAPI.Services
{
    public class ImageService
    {
        private readonly IHostEnvironment _hostEnvironment;

        public ImageService(
            IHostEnvironment hostingEnvironment)
        {
            _hostEnvironment = hostingEnvironment;
        }

        public ImageUploadModel uploadImage(IFormFile imageFile, string folder)
        {
            ImageUploadModel imageUploadModel = new Models.ImageUploadModel();
            try
            {
                var pathToSave = _hostEnvironment.ContentRootPath + "\\wwwroot\\api\\Images\\" + folder + "\\";

                var fileName = imageFile.FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);

                using (FileStream fileStream = System.IO.File.Create(fullPath))
                {
                    imageFile.CopyTo(fileStream);
                    fileStream.Flush();

                    
                    imageUploadModel.Path = "\\api\\Images\\" + folder + "\\" + fileName;
                    imageUploadModel.Status = 1;

                    return imageUploadModel;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                imageUploadModel.Path = "Faild. File length: " + imageFile.Length;
                imageUploadModel.Status = 0;
                return imageUploadModel;
            }
        }

        public string deleteFolder(string fileName)
        {
            Debug.WriteLine("fileName.Length: " + fileName.Length);
            var fileNamewithoutFileType = fileName.Substring(0, fileName.Length - 4);
            var filePathOriginal = _hostEnvironment.ContentRootPath + "\\api\\Images\\original\\" + fileName;
            var filePathResized = _hostEnvironment.ContentRootPath + "\\api\\Images\\resized\\" + fileNamewithoutFileType + "_resized.jpg";
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
            using var destImage = new Bitmap(resizedWidth, resizedHeight);

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
