document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressControls = document.getElementById('compressControls');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 处理文件拖放
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            processImage(file);
        }
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    });

    // 处理图片压缩
    function processImage(file) {
        // 检查文件类型
        if (!file.type.match('image/(jpeg|png)')) {
            alert('请上传 PNG 或 JPG 格式的图片！');
            return;
        }
        
        // 检查文件大小（限制为 20MB）
        if (file.size > 20 * 1024 * 1024) {
            alert('图片大小不能超过 20MB！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = `大小：${(file.size / 1024 / 1024).toFixed(2)} MB`;
            
            compressControls.style.display = 'block';
            previewArea.style.display = 'flex';
            
            compressImage(e.target.result, 0.8);
        };
        
        reader.onerror = () => {
            alert('读取文件失败，请重试！');
        };
        
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(base64, quality) {
        const img = new Image();
        
        img.onerror = () => {
            alert('图片加载失败，请重试！');
        };
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            try {
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                compressedPreview.src = compressedDataUrl;
                
                const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
                document.getElementById('compressedSize').textContent = 
                    `大小：${(compressedSize / 1024 / 1024).toFixed(2)} MB`;
            } catch (error) {
                alert('压缩图片时出错，请重试！');
                console.error(error);
            }
        };
        
        img.src = base64;
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', (e) => {
        const quality = e.target.value / 100;
        qualityValue.textContent = `${e.target.value}%`;
        compressImage(originalPreview.src, quality);
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });
}); 