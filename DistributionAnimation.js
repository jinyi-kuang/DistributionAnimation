    (function (window) {
      window.AnimatedDistributionBuilder = {
        init: function ({
          targetId,
          labels,
          values,
          dropSpeed = 700,
          autoAdvance = false,
          maxCount = 15
        }) {
          const container = document.getElementById(targetId);
          if (!container) return;

          let dropSequence = [];
          let bucketCounts = Array(labels.length).fill(0);

          function setupBuckets(maxCount = 10) {
            container.innerHTML = "";
            bucketCounts = Array(labels.length).fill(0);
            dropSequence = [];

            const ballSize = 30;
            const spacing = 2;
            const unitHeight = ballSize + spacing;
            const chartHeight = unitHeight * maxCount + spacing;
            const containerWidth = labels.length * (ballSize + 20) + 40;

            container.style.position = "relative";
            container.style.width = `${containerWidth}px`;
            container.style.height = `${chartHeight}px`;
            container.style.border = "1px solid #ccc";
            container.style.borderRadius = "10px";
            container.style.background = "white";
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
            container.style.paddingLeft = "40px";

            container.dataset.unitHeight = unitHeight;
            container.dataset.ballSize = ballSize;
            container.dataset.spacing = spacing;

            // Y-axis ticks
            const yAxis = document.createElement("div");
            yAxis.style.position = "absolute";
            yAxis.style.left = "0";
            yAxis.style.top = "0px";
            yAxis.style.bottom = "0px";
            yAxis.style.width = "40px";
            yAxis.style.display = "flex";
            yAxis.style.flexDirection = "column-reverse";
            yAxis.style.justifyContent = "space-between";
            yAxis.style.fontSize = "14px";
            yAxis.style.color = "#333";
            yAxis.style.userSelect = "none";

            for (let i = 1; i <= maxCount; i++) {
              const tick = document.createElement("div");
              tick.textContent = i;
              tick.style.height = `${unitHeight}px`;
              tick.style.lineHeight = `${unitHeight}px`;
              tick.style.textAlign = "right";
              tick.style.paddingRight = "5px";
              yAxis.appendChild(tick);
            }
            container.appendChild(yAxis);

            // Grid lines *between* balls
            const gridLines = document.createElement("div");
            gridLines.style.position = "absolute";
            gridLines.style.left = "40px";
            gridLines.style.top = "0px";
            gridLines.style.bottom = "0px";
            gridLines.style.right = "0";
            gridLines.style.pointerEvents = "none";
            gridLines.style.zIndex = "0";

            for (let i = 1; i < maxCount; i++) {
              const line = document.createElement("div");
              line.style.position = "absolute";
              line.style.left = "0";
              line.style.right = "0";
              line.style.height = "1px";
              line.style.backgroundColor = "#ccc";
              // line sits just above ball i
              line.style.top = `${i * unitHeight}px`;
              gridLines.appendChild(line);
            }
            container.appendChild(gridLines);

            // Buckets
            labels.forEach(labelText => {
              const bucket = document.createElement("div");
              bucket.className = "bucket";
              bucket.style.flex = "1";
              bucket.style.height = "100%";
              bucket.style.borderLeft = "1px solid #ccc";
              bucket.style.position = "relative";
              bucket.style.display = "flex";
              bucket.style.flexDirection = "column";
              bucket.style.justifyContent = "flex-end";
              bucket.style.alignItems = "center";
              bucket.style.paddingBottom = `${ballSize + 10}px`;

              const label = document.createElement("div");
              label.className = "bucket-label";
              label.textContent = labelText;
              label.style.position = "absolute";
              label.style.bottom = "-30px";
              label.style.width = "100%";
              label.style.textAlign = "center";
              label.style.fontSize = "14px";
              label.style.backgroundColor = "#e9ecef";
              label.style.borderTop = "1px solid #ccc";
              label.style.padding = "2px 0";

              bucket.appendChild(label);
              container.appendChild(bucket);
            });
          }

          function dropBall(bucketIndex, speed) {
            const bucket = container.children[bucketIndex + 1];
            const count = bucketCounts[bucketIndex]++;
            dropSequence.push(bucketIndex);

            const ballSize = parseFloat(container.dataset.ballSize);
            const unitHeight = parseFloat(container.dataset.unitHeight);

            const ball = document.createElement("div");
            ball.className = "ball";
            ball.style.width = `${ballSize}px`;
            ball.style.height = `${ballSize}px`;
            ball.style.borderRadius = "50%";
            ball.style.background = "steelblue";
            ball.style.margin = "0 0 2px 0";
            ball.style.transition = `transform ${speed}ms ease`;
            ball.style.transform = `translateY(-${(count + 1) * unitHeight}px)`;

            bucket.appendChild(ball);

            requestAnimationFrame(() => {
              ball.style.transform = "translateY(0)";
            });
          }

          async function animateBalls(values, speed) {
            const shuffled = [...values].sort(() => Math.random() - 0.5);
            for (let val of shuffled) {
              dropBall(val, speed);
              await new Promise(r => setTimeout(r, speed + 100));
            }

            if (typeof Qualtrics !== 'undefined' && Qualtrics.SurveyEngine) {
              Qualtrics.SurveyEngine.setEmbeddedData("DropSequence", JSON.stringify(dropSequence));
              if (autoAdvance) document.getElementById("NextButton")?.click();
            }
          }

          setupBuckets(maxCount);
          animateBalls(values, dropSpeed);
        }
      };
    })(window);