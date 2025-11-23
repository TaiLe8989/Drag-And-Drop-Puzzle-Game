document.addEventListener("DOMContentLoaded", () => {
  // I. THIẾT LẬP CẤP ĐỘ VÀ NGUỒN ẢNH

  // ⚠️ LƯU Ý QUAN TRỌNG: THAY ĐỔI ĐƯỜNG DẪN ẢNH NGUỒN Ở ĐÂY
  // Các ảnh được sử dụng lý tưởng là 300x300 pixel
  const IMAGE_SOURCES = {
    easy: [
      "https://hinhcute.net/wp-content/uploads/2025/06/httpsanhcute.netwp-contentuploads202408Hinh-chibi-Luffy-va-cac-thanh-vien-trong-bang-don-gian-de-thuong.jpg", // Ảnh EASY 1 (2x2)
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/8c/e2/12/caption.jpg?w=500&h=500&s=1",
      "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
      "https://inkythuatso.com/uploads/thumbnails/800/2022/05/hinh-nen-dien-thoai-phong-canh-anime-dep-1-26-10-43-14.jpg",
    ],
    medium: [
      "https://hinhcute.net/wp-content/uploads/2025/06/httpsanhcute.netwp-contentuploads202409Anh-chibi-gau-truc-don-gian.jpg", // Ảnh MEDIUM 1 (5x5)
      "https://i.pinimg.com/736x/f4/db/36/f4db36833d76e78993d468ed5b437854.jpg",
      "https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/84181105_2720833598013171_5408315190984835072_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGX3ykOcKHkaEE1piOm_9EP8rAdC4ePZjfysB0Lh49mN_5BK_eaQk1qqabqYCrrGOQT7hV3MIrAo-LqlOLApg9h&_nc_ohc=5jTwpxy5LLkQ7kNvwHG3gKk&_nc_oc=AdlMCgIUJL-4dqa5pG4pJqgYv0xAumqIGBwWnH7abX_3OpX2fdQzGXvbpOvLGXCT56j1HXbJM_amnLuPN4HFa7Vb&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=8ZyaFJmIGr2EWVUaQY_BZQ&oh=00_AfjUcqATgutQ8SvqYj8qUFF84HBKb148tqIAaf_Z_9iq3A&oe=694A5FC2",
      "https://thuthuatnhanh.com/wp-content/uploads/2020/09/hinh-nen-xe-moto-dep-nhat.jpg",
    ],
    hard: [
      "https://tq6.mediacdn.vn/133514250583805952/2020/4/12/photo-1-158667385383681905040.jpg", // Ảnh HARD 1 (5x6, xoay ngược)
      "https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/avatar-cute-36.jpg",
      "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/488069187_1079431950881726_8458115030137303017_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHXcXJMMaHhrcA3-syomvQHca-FchV5BG9xr4VyFXkEb-cJ8YVpAUbCNNKQzuSVCS2U6v3u4EyQBaRujPdGntKa&_nc_ohc=fMVhhosKrCMQ7kNvwEdpEjC&_nc_oc=Adn-slWmpeu9cc1hGcJh0NePmaBBeNPN2QPUhPU2XGzFEMOhQUoonxTDSfU0-zEc_k0S3d0fhUCWvmLajQWdYcr_&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=UKmI2a93u7GusFQOTBEjoA&oh=00_AfhlrV4Yk_y18L-u79oERz51L5bryqD5EyqKrbmK3Da09Q&oe=69289ECB",
      "https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/avatar-cute-17.jpg",
    ],
  };

  const LEVEL_CONFIGS = {
    easy: { rows: 2, cols: 2, puzzleClass: "grid-2x2", isRotated: false },
    medium: { rows: 5, cols: 5, puzzleClass: "grid-5x5", isRotated: false },
    hard: { rows: 6, cols: 5, puzzleClass: "grid-5x6", isRotated: true }, // 5 cột, 6 hàng = 30 mảnh
  };

  // II. KHAI BÁO BIẾN TRẠNG THÁI VÀ PHẦN TỬ DOM
  let currentLevel = null;
  let currentConfig = null;
  let currentImageSource = null;
  let piecesInTarget = 0;
  let TOTAL_PIECES = 0;

  // Các phần tử DOM
  const homePage = document.getElementById("home-page");
  const imageSelectionPage = document.getElementById("image-selection-page");
  const gamePlayPage = document.getElementById("game-play-page");
  const backButton = document.getElementById("back-button");
  const currentLevelDisplay = document.getElementById("current-level-display");
  const imageSelectionGrid = document.getElementById("image-selection-grid");
  const sourceArea = document.getElementById("source-area");
  const targetArea = document.getElementById("target-area");
  const feedbackMessage = document.getElementById("feedback-message");
  const hintImageContainer = document.getElementById("hint-image-container");
  const hintImage = document.getElementById("hint-image");

  let currentDragPiece = null;
  let currentView = "home"; // Trạng thái hiện tại: 'home', 'select_image', 'game'

  // III. QUẢN LÝ ĐIỀU HƯỚNG GIỮA CÁC TRẠNG THÁI (VIEWS)

  /**
   * Chuyển đổi giữa các trạng thái giao diện.
   * @param {string} view - 'home', 'select_image', hoặc 'game'
   */
  function switchView(view) {
    // Ẩn tất cả các trang và nút back trước
    [homePage, imageSelectionPage, gamePlayPage].forEach((el) =>
      el.classList.add("hidden")
    );
    backButton.classList.add("hidden");
    resetFeedback();

    currentView = view;

    if (view === "home") {
      homePage.classList.remove("hidden");
    } else if (view === "select_image") {
      imageSelectionPage.classList.remove("hidden");
      backButton.classList.remove("hidden");
      renderImageSelection();
    } else if (view === "game") {
      gamePlayPage.classList.remove("hidden");
      backButton.classList.remove("hidden");
      initializeGame();
    }
  }

  // Xử lý nút BACK (Điều hướng phức tạp)
  backButton.addEventListener("click", () => {
    if (currentView === "game") {
      resetGamePage();
      switchView("select_image"); // Trạng thái 3 -> Trạng thái 2
    } else if (currentView === "select_image") {
      switchView("home"); // Trạng thái 2 -> Trạng thái 1
    }
  });

  // Xử lý nút chọn cấp độ
  document.querySelectorAll(".level-button").forEach((button) => {
    button.addEventListener("click", function () {
      currentLevel = this.dataset.level;
      currentConfig = LEVEL_CONFIGS[currentLevel];
      currentLevelDisplay.textContent = currentLevel.toUpperCase();
      switchView("select_image");
    });
  });

  // IV. TRẠNG THÁI 2: TRANG CHỌN ẢNH

  function renderImageSelection() {
    imageSelectionGrid.innerHTML = "";
    const sources = IMAGE_SOURCES[currentLevel];

    sources.forEach((src) => {
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("image-thumbnail");
      thumbnail.style.backgroundImage = `url(${src})`;
      thumbnail.dataset.source = src;

      thumbnail.addEventListener("click", function () {
        currentImageSource = this.dataset.source;
        switchView("game");
      });

      imageSelectionGrid.appendChild(thumbnail);
    });
  }

  // V. TRẠNG THÁI 3: LOGIC TRÒ CHƠI VÀ TẠO MẢNH GHÉP

  function initializeGame() {
    const rows = currentConfig.rows;
    const cols = currentConfig.cols;
    const isRotated = currentConfig.isRotated;

    TOTAL_PIECES = rows * cols;
    // Kích thước ô vuông/chữ nhật (300x300)
    const PIECE_UNIT_WIDTH = 300 / cols;
    const PIECE_UNIT_HEIGHT = 300 / rows;
    piecesInTarget = 0;

    // 1. Dọn dẹp
    sourceArea.innerHTML = "<h2>Mảnh Ghép Lộn Xộn</h2>"; // Giữ lại tiêu đề Khu vực 1
    targetArea.innerHTML = "";
    targetArea.className = "target-grid";
    targetArea.classList.add(currentConfig.puzzleClass);

    // Thiết lập ảnh gợi ý (Khu vực 3)
    if (currentLevel === "hard") {
      hintImageContainer.classList.remove("hidden");
      hintImage.src = currentImageSource;
    } else {
      hintImageContainer.classList.add("hidden");
    }

    // 2. Tạo Mảnh Ghép (Puzzle Pieces) & Khung đích (Slots)
    const pieces = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const id = i * cols + j;
        const piece = createSquarePiece(
          id,
          i,
          j,
          PIECE_UNIT_WIDTH,
          PIECE_UNIT_HEIGHT,
          isRotated
        );
        const slot = createSquareSlot(id, PIECE_UNIT_WIDTH, PIECE_UNIT_HEIGHT);

        pieces.push(piece);
        targetArea.appendChild(slot);
      }
    }

    // 3. Xáo trộn và thêm vào Khu vực lộn xộn (Source Area)
    shuffleArray(pieces);
    pieces.forEach((piece) => sourceArea.appendChild(piece));
  }

  function resetGamePage() {
    // Dọn dẹp các mảnh ghép và slot
    sourceArea.innerHTML = "";
    targetArea.innerHTML = "";
    piecesInTarget = 0;
    currentDragPiece = null;
    hintImageContainer.classList.add("hidden");
  }

  // --- HÀM TẠO MẢNH GHÉP VUÔNG/CHỮ NHẬT ---
  function createSquarePiece(id, row, col, width, height, isRotated) {
    const piece = document.createElement("div");
    piece.classList.add("puzzle-piece");
    piece.setAttribute("draggable", "true");
    piece.dataset.id = id;

    piece.style.width = `${width}px`;
    piece.style.height = `${height}px`;

    const backgroundX = -col * width;
    const backgroundY = -row * height;

    piece.style.backgroundImage = `url(${currentImageSource})`;
    piece.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;

    if (isRotated) {
      piece.classList.add("hard-rotated");
    }

    piece.addEventListener("dragstart", handleDragStart);
    piece.addEventListener("dragend", handleDragEnd);

    return piece;
  }

  function createSquareSlot(id, width, height) {
    const slot = document.createElement("div");
    slot.classList.add("puzzle-slot");
    slot.dataset.slotId = id;
    slot.style.width = `${width}px`;
    slot.style.height = `${height}px`;

    slot.addEventListener("dragover", handleDragOver);
    slot.addEventListener("drop", handleDrop);
    return slot;
  }

  // Hàm xáo trộn mảng
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // VI. LOGIC KÉO VÀ THẢ

  function handleDragStart(e) {
    currentDragPiece = this;
    setTimeout(() => {
      currentDragPiece.classList.add("dragging");
    }, 0);
    // Lưu dataId của mảnh ghép đang kéo
    e.dataTransfer.setData("text/plain", currentDragPiece.dataset.id);
  }

  function handleDragEnd() {
    if (currentDragPiece) {
      currentDragPiece.classList.remove("dragging");
      currentDragPiece = null;
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (this.children.length === 0) {
      e.dataTransfer.dropEffect = "move";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const slot = this;

    // Lấy mảnh ghép đang kéo
    const pieceId = e.dataTransfer.getData("text/plain");
    // Tìm mảnh ghép trên DOM thông qua id và class 'dragging' (hoặc tìm trong source/target)
    // Cách an toàn hơn là tìm tất cả và lọc ra mảnh đang bị kéo
    const pieceToMove =
      document.querySelector(`.puzzle-piece[data-id="${pieceId}"].dragging`) ||
      document.querySelector(
        `#source-area > .puzzle-piece[data-id="${pieceId}"]`
      ) ||
      document.querySelector(
        `#target-area > .puzzle-slot > .puzzle-piece[data-id="${pieceId}"]`
      );

    if (slot.children.length === 0 && pieceToMove) {
      // 1. Cập nhật count
      if (pieceToMove.parentNode.classList.contains("puzzle-slot")) {
        piecesInTarget--; // Lấy ra khỏi một slot khác
      }

      // 2. Di chuyển mảnh ghép
      slot.appendChild(pieceToMove);

      // 3. Tăng count (vì nó vừa được thả vào một slot trống)
      piecesInTarget++;

      // 4. Kiểm tra trạng thái trò chơi
      if (piecesInTarget === TOTAL_PIECES) {
        setTimeout(checkWinCondition, 300);
      }
    }
  }

  // VII. KIỂM TRA VÀ PHẢN HỒI

  function checkWinCondition() {
    let isCorrect = true;
    const slots = targetArea.querySelectorAll(".puzzle-slot");

    slots.forEach((slot) => {
      const piece = slot.querySelector(".puzzle-piece");
      if (!piece || piece.dataset.id !== slot.dataset.slotId) {
        isCorrect = false;
      }
    });

    // Hiển thị phản hồi
    showFeedback(isCorrect);

    if (!isCorrect) {
      // Logic bắt buộc: Nếu SAI, tất cả các mảnh ghép sẽ bị xáo trộn lại và trở về khu vực nguồn.

      // 1. Lấy tất cả mảnh ghép (từ target và source)
      const piecesInTarget = Array.from(
        targetArea.querySelectorAll(".puzzle-piece")
      );
      const piecesInSource = Array.from(
        sourceArea.querySelectorAll(".puzzle-piece:not(h2)")
      ); // Loại bỏ h2

      // 2. Tổng hợp tất cả mảnh ghép
      const allPieces = piecesInTarget.concat(piecesInSource);

      // 3. Xóa các mảnh ghép khỏi vị trí cũ
      piecesInTarget.forEach((piece) => piece.parentNode.removeChild(piece));
      sourceArea.innerHTML = "<h2>Mảnh Ghép Lộn Xộn</h2>"; // Dọn dẹp sourceArea

      // 4. Xáo trộn lại và đặt vào sourceArea
      shuffleArray(allPieces);
      allPieces.forEach((piece) => {
        sourceArea.appendChild(piece);
      });

      piecesInTarget = 0; // Đặt lại số mảnh ghép trong khung đích
    } else {
      // Nếu ĐÚNG, chuyển về trang chọn ảnh sau 3 giây.
      setTimeout(() => {
        switchView("select_image");
      }, 3000);
    }
  }

  /**
   * Hiển thị thông báo phản hồi (trượt từ trên xuống)
   * @param {boolean} isCorrect - Trạng thái thắng/thua
   */
  function showFeedback(isCorrect) {
    feedbackMessage.classList.remove(
      "hidden",
      "feedback-correct",
      "feedback-incorrect",
      "feedback-slide-in"
    );

    if (isCorrect) {
      feedbackMessage.textContent = "🥳 Đúng rồi, bạn giỏi quá!";
      feedbackMessage.classList.add("feedback-correct");
    } else {
      feedbackMessage.textContent = "😔 Sai rồi, bạn làm lại nha.";
      feedbackMessage.classList.add("feedback-incorrect");
    }

    // Bắt đầu trượt vào (HIỆU ỨNG BẮT BUỘC HOÀN THIỆN)
    setTimeout(() => {
      feedbackMessage.classList.add("feedback-slide-in");
    }, 50);

    // Tự động ẩn sau 3 giây
    setTimeout(resetFeedback, 3000);
  }

  function resetFeedback() {
    feedbackMessage.classList.remove("feedback-slide-in");
    // Ẩn hoàn toàn sau khi trượt ra
    setTimeout(() => {
      feedbackMessage.classList.add("hidden");
    }, 600);
  }

  // Khởi động ở trạng thái Trang Chủ
  switchView("home");
});
