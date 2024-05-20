def generate_sql_query(kelime, anlami, cumleicinde,gorsel,ses):
    return f"INSERT INTO 6kelimetekrar.words (word, word_meaning, word_in_sentence, word_image, word_voice) VALUES ('{kelime}', '{anlami}', '{cumleicinde}', '{gorsel}', '{ses}');"

def save_sql_query_to_txt(sql_query, file_path):
    try:
        with open(file_path, 'a', encoding='utf-8') as file:
            file.write(sql_query + "\n")
    except Exception as e:
        print("Dosya yazma hatası:", e)

def main():
    input_file_path = "C:\\Users\\geire\\OneDrive\\Belgeler\\GitHub\\6SeferileKelimeEzberlemeSistemi\\database\\input.txt"
    output_file_path = "C:\\Users\\geire\\OneDrive\\Belgeler\\GitHub\\6SeferileKelimeEzberlemeSistemi\\database\\output.txt"

    with open(input_file_path, 'r', encoding='utf-8') as file:
        for line in file:
            kelime, anlami, cumleicinde, gorsel, ses = line.strip().split('-')
            gorsel = "\"" + "\\api\\gorseller\\" +gorsel + "\"" 
            ses = "\"" + "\\api\\sesler\\" + ses + "\"" 
            sql_query = generate_sql_query(kelime, anlami, cumleicinde,gorsel,ses)
            save_sql_query_to_txt(sql_query, output_file_path)

    print("Tüm satırlar işlendi ve SQL sorguları dosyaya kaydedildi.")

if __name__ == "__main__":
    main()
