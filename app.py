from flask import Flask, render_template, request, jsonify, send_from_directory, url_for
import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend so it works on all systems

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
CHART_FOLDER = 'static/charts'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CHART_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'csv', 'json', 'xls', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_data(df):
    df = df.dropna().drop_duplicates().convert_dtypes()
    return df

def generate_chart(df, chart_type, x_col=None, y_col=None):
    chart_filename = f"{chart_type}_{x_col or 'none'}_{y_col or 'none'}.png".replace(" ", "_")
    chart_path = os.path.join(CHART_FOLDER, chart_filename)

    # Set Seaborn style
    sns.set_theme(style="whitegrid")

    # Create figure
    plt.figure(figsize=(10, 6))

    try:
        # Chart generation based on type
        if chart_type == 'barplot':
            sns.barplot(data=df, x=x_col, y=y_col, palette="pastel")
            plt.xlabel(x_col)
            plt.ylabel(y_col)
        elif chart_type == 'countplot':
            sns.countplot(data=df, x=x_col, palette="Set2")
            plt.xlabel(x_col)
            plt.ylabel("Count")
        elif chart_type == 'boxplot':
            sns.boxplot(data=df, x=x_col, y=y_col, palette="coolwarm")
            plt.xlabel(x_col)
            plt.ylabel(y_col)
        elif chart_type == 'heatmap':
            sns.heatmap(df.corr(), annot=True, cmap='coolwarm', linewidths=0.5)
        elif chart_type == 'scatterplot':
            sns.scatterplot(data=df, x=x_col, y=y_col, color='blue', edgecolor='black')
            plt.xlabel(x_col)
            plt.ylabel(y_col)
        else:  # default to histplot
            sns.histplot(data=df, x=x_col, bins=20, kde=True, color='skyblue')
            plt.xlabel(x_col)
            plt.ylabel("Frequency")

        # Add title
        title = f"{chart_type.title()} of {y_col} vs {x_col}" if y_col else f"{chart_type.title()} of {x_col}"
        plt.title(title, fontsize=14)

        # Final layout tweaks
        plt.tight_layout()
        plt.grid(True)

        # Save and close the plot
        plt.savefig(chart_path)
        plt.close()

        print(f"✅ Chart saved at: {chart_path}")
        return chart_filename

    except Exception as e:
        print(f"❌ Error generating chart: {e}")
        plt.close()
        return None

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/features')
def features():
    return render_template('feature.html')
@app.route('/basic', methods=['GET', 'POST'])
def basic():
    if request.method == 'POST':
        file = request.files.get('file')
        chart_type = request.form.get('chart_type')
        x_col = request.form.get('x_col')
        y_col = request.form.get('y_col')

        if file and allowed_file(file.filename):
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)

            if file.filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            elif file.filename.endswith('.json'):
                df = pd.read_json(filepath)
            else:
                df = pd.read_excel(filepath)

            df = clean_data(df)
            chart_filename = generate_chart(df, chart_type, x_col, y_col)

            if chart_filename:
                return jsonify({
                    'chart_url': f"/static/charts/{chart_filename}",
                    'download_url': url_for('download', filename=chart_filename)
                })
            else:
                return jsonify({'error': 'Chart generation failed. Check columns or chart type.'})
        else:
            return jsonify({'error': 'Invalid file type. Please upload CSV, JSON, or Excel.'})

    return render_template('index.html')

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(CHART_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)

