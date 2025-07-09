(function(window) {
  window.AnimatedDistributionBuilder = {
    init: function({ targetId, labels, values, onSubmit }) {
      const container = document.getElementById(targetId);
      container.innerHTML = ""; // clear existing

      const nBuckets = labels.length;
      const bucketCounts = Array(nBuckets).fill(0);

      container.style.position = "relative";
      container.style.width = "600px";
      container.style.height = "300px";
      container.style.border = "1px solid #ccc";
      container.style.display = "flex";
      container.style.justifyContent = "space-between";

      for (let i = 0; i < nBuckets; i++) {
        const bucket = document.createElement("div");
        bucket.className = "bucket";
        bucket.style.flex = "1";
        bucket.style.height = "100%";
        bucket.style.borderLeft = "1px solid #ccc";
        bucket.style.position = "relative";

        const label = document.createElement("div");
        label.className = "bucket-label";
        label.textContent = labels[i];
        label.style.position = "absolute";
        label.style.bottom = "0";
        label.style.width = "100%";
        label.style.textAlign = "center";
        label.style.fontSize = "12px";
        label.style.backgroundColor = "#f8f8f8";
        label.style.borderTop = "1px solid #ccc";

        bucket.appendChild(label);
        container.appendChild(bucket);
      }

      function dropBall(bucketIndex) {
        const bucket = container.children[bucketIndex];
        const count = bucketCounts[bucketIndex];
        bucketCounts[bucketIndex] += 1;

        const ball = document.createElement("div");
        ball.className = "ball";
        ball.style.width = "20px";
        ball.style.height = "20px";
        ball.style.borderRadius = "50%";
        ball.style.background = "steelblue";
        ball.style.position = "absolute";
        ball.style.top = "0";
        ball.style.left = "50%";
        ball.style.transform = "translateX(-50%)";
        ball.style.transition = "top 0.7s ease";

        bucket.appendChild(ball);

        requestAnimationFrame(() => {
          ball.style.top = (bucket.clientHeight - 45 - count * 22) + "px";
        });
      }

      function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
      }

      async function animateBalls(values) {
        const shuffled = shuffle([...values]);
        for (let val of shuffled) {
          dropBall(val);
          await new Promise(r => setTimeout(r, 600));
        }
      }

      animateBalls(values);

      // Submit logic
      if (typeof onSubmit === "function") {
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit Distribution";
        submitBtn.style.marginTop = "20px";
        submitBtn.style.padding = "8px 16px";
        submitBtn.style.fontSize = "14px";
        container.parentElement.appendChild(submitBtn);

        submitBtn.addEventListener("click", () => {
          onSubmit(bucketCounts);

          if (typeof Qualtrics !== 'undefined' && Qualtrics.SurveyEngine) {
            Qualtrics.SurveyEngine.setEmbeddedData("AnimatedDistribution", JSON.stringify(bucketCounts));
          }
        });
      }
    }
  };
})(window);
