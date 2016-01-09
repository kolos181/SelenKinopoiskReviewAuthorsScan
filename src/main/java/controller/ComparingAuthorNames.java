package controller;

import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Kolos on 09.01.2016.
 */
public class ComparingAuthorNames {
    public static void main(String[] args) {
        String mad = "\nFilmoman DAB\n" +
                "ProActor\n" +
                "nikvvp\n" +
                "Lirik85\n" +
                "Maksim_Shustov\n" +
                "jahkut\n" +
                "KapPat\n" +
                "Crazy_Demon\n" +
                "Pleymore\n" +
                "CynepKoT\n" +
                "Cherrytie\n" +
                "writer19\n" +
                "Dentr Scorpio\n" +
                "Денис Юрьев\n" +
                "сисеро\n" +
                "rn21\n" +
                "Alenalove\n" +
                "Paranoik-kinofan\n" +
                "NikitaBoychuk\n" +
                "Nemerria\n" +
                "Shakutin\n" +
                "Fenolftalein\n" +
                "Devil Movie Examiner\n" +
                "DarkPrince\n" +
                "AndrewSTAR1990\n" +
                "Andrew Laeddis\n" +
                "19Taras97\n" +
                "Александр14\n" +
                "Kalugin\n" +
                "DJ-GisH\n" +
                "Рузанна\n" +
                "Alan Capcace\n" +
                "NikaNavi\n" +
                "ne-mogu-pridumat-nik\n" +
                "Alex Croft\n" +
                "Makaveli96\n" +
                "Kinomash\n" +
                "Veremianyn\n" +
                "Man from Paper St\n" +
                "goshavip\n" +
                "Montege\n" +
                "ArtSparrows\n" +
                "ТРОНутый Дюдаист\n" +
                "Дейгер\n" +
                "renod\n" +
                "StarstruckDevil\n" +
                "sergey sin\n" +
                "kleio13\n" +
                "Просто Шурик\n" +
                "LouisLitt007\n" +
                "T.B.25\n" +
                "Saffron Burrows\n" +
                "ArtemTema\n" +
                "SerjKytkin\n" +
                "Dsholgin\n" +
                "TVBurbon\n" +
                "leisureblog-ru\n" +
                "ChildInside\n" +
                "God Save The Queen\n" +
                "elena str\n" +
                "kati82\n" +
                "Alice Anderson\n" +
                "Пров\n" +
                "Anne_Maria\n" +
                "Valpariso\n" +
                "KillStar\n" +
                "foal\n" +
                "mkostin_ru\n" +
                "plantasy\n" +
                "Mentor Patros Dominatus\n" +
                "Шарти\n" +
                "PALPATINE\n" +
                "Alex Morales\n" +
                "Pretty Assassin\n" +
                "Дикий Пушистик\n" +
                "ekaterina-e\n" +
                "shnur777\n" +
                "Nolan\n" +
                "Arakelova_a\n" +
                "Эль Аким\n" +
                "verakuharchuk\n" +
                "Maggotpnz\n" +
                "Martin389\n" +
                "hatalikov\n" +
                "Frau_von_Till\n" +
                "amico\n" +
                "NiX9000\n" +
                "anyuta_x\n" +
                "Love625\n" +
                "RazorMW\n" +
                "ZMЕЙ\n" +
                "Boris88\n" +
                "marcus_fenix\n" +
                "Ledokol4ik\n" +
                "Gerbus\n" +
                "vmvasusya\n" +
                "Ру Иллюзионист\n" +
                "Soleyl\n" +
                "Klirik27\n" +
                "Alexandr Kinolove\n" +
                "ninaV\n" +
                "Oroborus\n" +
                "Sykes\n" +
                "Екатерина Балакирева\n" +
                "VadimCzech\n" +
                "_Stronglav_\n" +
                "Andrey1990\n" +
                "Ilyuhius\n" +
                "AlissA\n" +
                "DariyaDelich\n" +
                "emarulina\n" +
                "foreverafish\n" +
                "Леоник\n" +
                "pashaa9a\n" +
                "pasha borisov\n" +
                "Михаил Романенко\n" +
                "Буянис\n" +
                "Mr. Dan4ik\n" +
                "Миша-35\n" +
                "Suarez7\n" +
                "Vaeringjar_1944\n" +
                "Heisenberg2015\n" +
                "crazy kinogolik\n" +
                "Norman94\n" +
                "MC LOUD\n" +
                "KereyMan\n" +
                "Ah Anton\n" +
                "lonely grey\n" +
                "Горевой\n" +
                "Кэмбелл\n" +
                "Bad Reputation\n" +
                "Heywood\n" +
                "Pure Nothing\n" +
                "Mr_Karandash\n" +
                "Denis_T\n" +
                "Noldo\n" +
                "Glagolus\n" +
                "LittleManWhoLivesInTheMoss\n" +
                "RahaHollywood\n" +
                "sasha_misar\n" +
                "Lavrv1990\n" +
                "Kelevra33\n" +
                "Vadim Bogdanov\n" +
                "Bloodn Lord\n" +
                "Учат в школе\n" +
                "BigFobos\n" +
                "BroonCard\n" +
                "Sonic-Youth\n" +
                "Олег Витвицки\n" +
                "misha_kolesnikov\n" +
                "Артур Лихтин\n" +
                "Direbitchwolf\n" +
                "Matamune\n" +
                "BL113TZ\n" +
                "Kirillpolyakovv\n" +
                "leonhawk\n" +
                "Mark Bronski\n" +
                "yankeees\n" +
                "kos-2010\n" +
                "Bacary\n" +
                "ArtyomLyalin\n" +
                "fingers_go_postal\n" +
                "Izzi_99\n" +
                "mistandsnow\n" +
                "FreakInvision\n" +
                "Dreamfucker\n" +
                "catalyst_wtrclr\n" +
                "Алексей Серебренников\n" +
                "Sylar-best\n" +
                "FallensideDI\n" +
                "Игорь Гордиан\n" +
                "kateRM\n" +
                "сакен\n" +
                "Pavel Kozlovskiy\n" +
                "I love movies\n" +
                "YourOldFriend\n" +
                "Seniorita Cinema\n" +
                "llawlite\n" +
                "eron\n" +
                "MrMynthon\n" +
                "Gorak1\n" +
                "Corvinc\n" +
                "Doctorblues3\n" +
                "DariyaDelich\n" +
                "Рустем Хабибуллин\n" +
                "Grannie M\n" +
                "42nisssssssssssssssmo\n" +
                "prince_kinoman\n" +
                "Angel-T\n" +
                "defocgen\n" +
                "Ref_Lection\n" +
                "ARTEM_JOCKER\n" +
                "SUGARIAM\n" +
                "TeHop\n" +
                "Burmakin\n" +
                "ANDrevenge\n" +
                "selector\n" +
                "freetitelu\n" +
                "Александр Бутусов\n" +
                "Critican\n" +
                "Mary Wortington\n" +
                "Howling with wolves\n" +
                "King18\n" +
                "levelson01\n" +
                "Артем Петров\n" +
                "jhones2012\n" +
                "blue cactus\n" +
                "Oleg Podporin\n" +
                "Paul Paulus\n" +
                "alexandraiordanidi\n" +
                "Vandr\n" +
                "bagdadsky_vor\n" +
                "Marina_Tkach\n" +
                "king metall\n" +
                "atonwarno\n" +
                "Миха Скорость\n" +
                "Mjkarpenter\n" +
                "J Green\n" +
                "Lintandil\n" +
                "AxelPAL\n" +
                "Batyay\n" +
                "Pekarich\n" +
                "vatsson\n" +
                "StayToFrosty\n" +
                "Ali_Mensaf\n" +
                "suicideakira\n" +
                "Korosten\n" +
                "pentiumman\n" +
                "Skrooged\n" +
                "sergant_l\n" +
                "aramis21\n" +
                "Сергей Губин\n" +
                "DeviJohnes\n" +
                "Dangerous_deer\n" +
                "Димчик Шилов\n" +
                "frentik\n" +
                "Ansiya Tera\n" +
                "Kirill Corbain\n" +
                "maks610\n" +
                "Ермоченко Дмитрий\n" +
                "Laaazyman\n" +
                "avokasu\n" +
                "Bongoo\n" +
                "Hartis92\n" +
                "Серёжа Дёмин\n" +
                "soundslash\n" +
                "SevER_7\n" +
                "Гризельда\n" +
                "plantagenet1133\n" +
                "Инфонт\n" +
                "JackThePumpkin\n" +
                "Wickone\n" +
                "Midolya\n" +
                "Targarien\n" +
                "Chriz Bale\n" +
                "Ruslan Nikulin\n" +
                "NadiaCG\n" +
                "tarasestok\n" +
                "Tristo\n" +
                "Alec Zinya\n" +
                "blackoleander\n" +
                "Shikari37\n" +
                "apupezig\n" +
                "Jevgeni Levik\n" +
                "БудьЗдоров\n" +
                "Балем\n" +
                "kdoynikova\n" +
                "NikolayChernyshev\n" +
                "marusya_m84\n" +
                "Beatrix Kiddo\n" +
                "Emmett Doc Brown\n" +
                "Zagnitucci\n" +
                "Александр Шукуров\n" +
                "ODDREN\n" +
                "-Craft-\n" +
                "BJ Blazkowicz\n" +
                "sergio_94\n" +
                "ivasha1985\n" +
                "SueSmEm\n" +
                "CaineM\n" +
                "El_principe\n" +
                "a teacher\n" +
                "NastiFan\n" +
                "quaresma19947\n" +
                "kino_dok\n" +
                "Incognito666\n" +
                "dim_led\n" +
                "Olegenikus\n" +
                "TRTH HRTZ\n" +
                "Hisui2710\n" +
                "VLADos9728\n" +
                "Juvle\n" +
                "Zloy_Kott\n" +
                "Mikhail Khorpyakov\n" +
                "cchheellRUS\n" +
                "farba4ka\n" +
                "iMisteriA\n" +
                "moses1991\n" +
                "BeastER2k\n" +
                "Redhard59\n" +
                "JustMK\n" +
                "Soure\n" +
                "Scariri\n" +
                "helenadolgih\n" +
                "Holly-Wood\n" +
                "translira\n" +
                "MaxiKowalski\n" +
                "Armata\n" +
                "Upitko\n" +
                "TJS\n" +
                "calmykov\n" +
                "prouste\n" +
                "DaleCo\n" +
                "Ольга Лабецкая\n" +
                "maryzhi\n" +
                "+CruS@DeR+\n" +
                "M.ulitin\n" +
                "melanega\n" +
                "Green-Hedgehog\n" +
                "Подарок небес\n" +
                "Observer_XXI\n" +
                "the narrator\n" +
                "Xakep19\n" +
                "Wikia\n" +
                "NorthMen\n" +
                "videohater\n" +
                "Егор Махонин\n" +
                "mayaesenina\n" +
                "McL@uD\n" +
                "glortz\n" +
                "Паша Соколов\n" +
                "olga_dolzhenko\n" +
                "blaze_john\n" +
                "menazi\n" +
                "gotikpankrock\n" +
                "Pusenkov\n" +
                "MilesDayson\n" +
                "MnogoMan\n" +
                "Cold Hearted Man\n" +
                "Patrikei Sazonoff\n" +
                "Den Kitaro\n" +
                "valkyrin\n" +
                "Mike Frost\n" +
                "shaixe\n" +
                "Clementinka Mandarinka\n" +
                "Time_30\n" +
                "alex-astra\n" +
                "JonnyJR\n" +
                "kirik b\n" +
                "Dimelly\n" +
                "Imperators\n" +
                "TaxManKharkov\n" +
                "DementorGargoyles\n";
        String inter = "\nLost__Soul\n" +
                "TheGreatCritic\n" +
                "DikCinema\n" +
                "Кирилл Васин\n" +
                "KillStar\n" +
                "Lirik85\n" +
                "Salander555\n" +
                "Хорват\n" +
                "Petr_008\n" +
                "MarkMk2\n" +
                "Charlie Cappa\n" +
                "Horseofhell\n" +
                "19Taras97\n" +
                "showstopper123\n" +
                "marcus_fenix\n" +
                "Kalugin\n" +
                "Alice Anderson\n" +
                "shaixe\n" +
                "fatfreeman\n" +
                "Global_Cinema\n" +
                "Cillian\n" +
                "vickers\n" +
                "tulupoff mix\n" +
                "AmethystEl\n" +
                "+44\n" +
                "Fon__Perez\n" +
                "Young Sandwich\n" +
                "dilightiiish\n" +
                "Devil Movie Examiner\n" +
                "cinephile George\n" +
                "Дикий Пушистик\n" +
                "Влад Бублик\n" +
                "Nightmare163\n" +
                "Kazan192\n" +
                "Ру Иллюзионист\n" +
                "Юрий Говорушко\n" +
                "sparrow hawk\n" +
                "Eriksson\n" +
                "Сева Торхов\n" +
                "ivanzypher\n" +
                "Filmoman DAB\n" +
                "anyuta_x\n" +
                "MashaGirl\n" +
                "-Loki\n" +
                "DenveR^13\n" +
                "God Save The Queen\n" +
                "pro100logik\n" +
                "semenovsv\n" +
                "Consulina\n" +
                "Martin Stlouis26\n" +
                "*PirateGirl*\n" +
                "TheNightblade\n" +
                "Юлека\n" +
                "Monk Iron\n" +
                "АндрЭ-Кино навсегда\n" +
                "alex-astra\n" +
                "DarkPrince\n" +
                "Bright person\n" +
                "Chegevara 2000\n" +
                "Alan Capcace\n" +
                "sapalakalusha\n" +
                "Saaart\n" +
                "mike_bog\n" +
                "ninaV\n" +
                "NEVERKIT\n" +
                "Mures_Bad\n" +
                "bumblebeeme\n" +
                "MarkMesh\n" +
                "Poopy17\n" +
                "goshavip\n" +
                "vital4ikk\n" +
                "romkowar\n" +
                "nikvvp\n" +
                "Norman94\n" +
                "Maggotpnz\n" +
                "Jack Napie\n" +
                "Zhexenov\n" +
                "Dominic Cobb\n" +
                "kharkovtchanin\n" +
                "Stellina_n1\n" +
                "valkyrin\n" +
                "Dancer Disko\n" +
                "АБэВэ\n" +
                "Alex Croft\n" +
                "Fortitude\n" +
                "Pleymore\n" +
                "Дейгер\n" +
                "sale&pepe_\n" +
                "AnnyAwake\n" +
                "kirik b\n" +
                "Niko_Lex\n" +
                "July_Altarf\n" +
                "Shakutin\n" +
                "Marcus Quintilianus\n" +
                "Луpдес\n" +
                "Agent Orange\n" +
                "plantasy\n" +
                "born66613\n" +
                "Александр Бутусов\n" +
                "KoshaD\n" +
                "Kreg Hak\n" +
                "Makaveli96\n" +
                "Ptichka_Golub\n" +
                "Cinema_Madman\n" +
                "ars-projdakov\n" +
                "Alessandro Desperado\n" +
                "Yuri Boyka\n" +
                "etermity\n" +
                "JackThePumpkin\n" +
                "IgorFomich\n" +
                "Stratorocker\n" +
                "sashque\n" +
                "Max Gareev\n" +
                "Olmer91\n" +
                "Rosa Damascena\n" +
                "sashaner1\n" +
                "РОСОМАХА-27\n" +
                "ZELMIRA\n" +
                "shuran-kutan\n" +
                "Родди Сент - Джеймс\n" +
                "Drake 195\n" +
                "Nephilimma\n" +
                "Watch_Man\n" +
                "Blade55\n" +
                "Bina_White\n" +
                "NeverGiveUpper\n" +
                "X-Histerica\n" +
                "Arxapostol\n" +
                "Денис Кулезенин\n" +
                "rinatkhamatov\n" +
                "shatillex\n" +
                "NaObi\n" +
                "KnightOfTheDarkness\n" +
                "Adept_one\n" +
                "flametongue\n" +
                "dinamometr\n" +
                "Teku100\n" +
                "Ким Чеш Ир\n" +
                "1bel1fe1gor\n" +
                "dimin\n" +
                "Алина Багаманова\n" +
                "sazam\n" +
                "Шерлок Бонд\n" +
                "Максим Черный\n" +
                "abolox\n" +
                "raven_r\n" +
                "Outcaster\n" +
                "Александр Гордеев\n" +
                "vatsson\n" +
                "Quick_Duck\n" +
                "nikoride\n" +
                "Brothers Lumiere\n" +
                "nuts068\n" +
                "C_B_J\n" +
                "Hugo92\n" +
                "Imperators\n" +
                "Matrixer\n" +
                "fabio52\n" +
                "bond_in\n" +
                "KuSok_GoVnA\n" +
                "Богдан Івасик\n" +
                "romanpnn0\n" +
                "Silen\n" +
                "AmiLi_fe\n" +
                "Metatel\n" +
                "Stanislav Malkov\n" +
                "RevizoR_MHV\n" +
                "GibsonGS\n" +
                "Yurko Bratyuk\n" +
                "monokio\n" +
                "VadimCzech\n" +
                "Arthur_Dishonored\n" +
                "mike_onkyo\n" +
                "Dolly Terry\n" +
                "AndrewSTAR1990\n" +
                "writer19\n" +
                "Чацкая\n" +
                "Оль4и\n" +
                "DoriN\n" +
                "Connor James\n" +
                "Suarez7\n" +
                "Димас Фоменко\n" +
                "theBourne\n" +
                "fabio rochemback\n" +
                "biyuma\n" +
                "Ali_Mensaf\n" +
                "Dentr Scorpio\n" +
                "_ nastenka _\n" +
                "Алишер Улфатшоев\n" +
                "Topsyk\n" +
                "Егор Стрелков\n" +
                "Kritik1234\n" +
                "Ирина Афутина\n" +
                "Ol272g\n" +
                "Wonderful_\n" +
                "TanyaKuldyaeva\n" +
                "Avrina\n" +
                "Egr-djatlov\n" +
                "zigafolk\n" +
                "sashamilky\n" +
                "Rusa_84\n" +
                "KapPat\n" +
                "ElenaJuly\n" +
                "menazi\n" +
                "kat5l\n" +
                "_time_\n" +
                "InNolanWeTrust\n" +
                "таам\n" +
                "Cellar\n" +
                "Diana Levina\n" +
                "zerolostlife\n" +
                "Кирилл Гальцев\n" +
                "АбрамоваСветлана\n" +
                "Elf70go\n" +
                "leona_levi\n" +
                "Neckrolace\n" +
                "Temk1s\n" +
                "Rib-Rob\n" +
                "Boria 2b\n" +
                "Soleyl\n" +
                "MC LOUD\n" +
                "Lonely Amerika\n" +
                "Pavel PS\n" +
                "PiterPink\n" +
                "Michael Babich\n" +
                "Capyhappy\n" +
                "Dmitry Butyrin\n" +
                "movieadicted\n" +
                "marik_belyakova\n" +
                "Rustaveli24\n" +
                "ZMЕЙ\n" +
                "ilyas_muromec\n" +
                "Твоя Дарья\n" +
                "elllibro\n" +
                "odyaksul\n" +
                "Звездный странник3114\n" +
                "The Felix\n" +
                "Prosto_User\n" +
                "Marsel EEC\n" +
                "AntoniQ\n" +
                "Keirana\n" +
                "Elizabeth_Cherry\n" +
                "Очиров Очир\n" +
                "Oleg Strizhov\n" +
                "RonsaRd\n" +
                "LikeCarrie\n" +
                "Nikita Ananiev\n" +
                "catalyst_wtrclr\n" +
                "mottzharov\n" +
                "Varley\n" +
                "Master Pirlo\n" +
                "spolding\n" +
                "Владимир Зайцев\n" +
                "Inhuman-Hate\n" +
                "Равномерная\n" +
                "darksaret\n" +
                "Андрей Корбут\n" +
                "SarcasmLevi\n" +
                "Жёлтый Король\n" +
                "Dima Bodler\n" +
                "Tristo\n" +
                "Christopher Johnson\n" +
                "Stargazer_21\n" +
                "Play For Blood\n" +
                "Psheshek\n" +
                "me_anastasia\n" +
                "Анна Аника\n" +
                "Woronessa de Lioncourt\n" +
                "NikitaBoychuk\n" +
                "marathakobjanyan\n" +
                "Belthazar\n" +
                "alexb1111\n" +
                "publicist\n" +
                "sladky_bubaleh\n" +
                "R2ssell\n" +
                "jumper1\n" +
                "moresoli\n" +
                "Swetonia\n" +
                "Людмила Цой\n" +
                "Andreyxxx\n" +
                "dret09\n" +
                "Listengort88\n" +
                "olga_dolzhenko\n" +
                "GopDronello\n" +
                "imFeodor\n" +
                "Wikia\n" +
                "fireproof84\n" +
                "mongalor\n" +
                "29magazine\n" +
                "Shikari37\n" +
                "Mozgodrobilka\n" +
                "gellesfir\n" +
                "Руслан Данилин\n" +
                "kotoFEYA\n" +
                "Soloveirasboinik\n" +
                "Mexbass\n" +
                "Алексей Корякин\n" +
                "Katarina_Pierre\n" +
                "artemraskin\n" +
                "Under_skY\n" +
                "Frau Adam\n" +
                "Ernest_Mannergeim\n" +
                "DharmaBums\n" +
                "saurizin\n" +
                "Ledmaer\n" +
                "Андрей Соколов\n" +
                "crazy kinogolik\n" +
                "BroonCard\n" +
                "Mudblood_dk\n" +
                "Engel77\n" +
                "Mallibay\n" +
                "Марина Жукова\n" +
                "DASHYle4KA\n" +
                "strontium 90\n" +
                "Victor Aksyutenko\n" +
                "syncopy\n" +
                "Alecia Moore\n" +
                "ekaterina-e\n" +
                "Кирилл Ганин\n" +
                "Xoma03\n" +
                "dwhiter\n" +
                "willaryR\n" +
                "Tarisha\n" +
                "AlissaShemmy\n" +
                "Time_30\n" +
                "elmonastya\n" +
                "MichMit\n" +
                "HerbalRabbit\n" +
                "klassen\n" +
                "Тишь - ше ивы\n" +
                "Saffron Burrows\n" +
                "SlyBale\n" +
                "Арика131\n" +
                "Юля Михайлюк\n" +
                "Хышка\n" +
                "marina_ricci\n" +
                "xbink\n" +
                "Mikaboshi\n" +
                "Михаил Вахутинский\n" +
                "Harvey Specter\n" +
                "святой безбожник\n" +
                "KivaiT\n" +
                "AwsomeRakowski\n" +
                "Tanniety\n" +
                "agmista_doo\n" +
                "Indilis\n" +
                "brunod\n" +
                "JojoMayer\n" +
                "askme_\n" +
                "Martin_Jiranek\n" +
                "Alexander Geksov\n" +
                "artildo\n" +
                "Opening Titles\n" +
                "Rin_Aquarius\n" +
                "Anihinimator\n" +
                "RichardRowe\n" +
                "Павел Володин\n" +
                "Neon4ick\n" +
                "kirillko61\n" +
                "Олег Ширяев\n" +
                "Бродяга Дхармы\n" +
                "Balekava\n" +
                "Roman Shchedrin\n" +
                "Ruglon\n" +
                "AndrewSN\n" +
                "andrushkamish\n" +
                "Химер Роковой\n" +
                "Soluntina\n" +
                "Aquarius4\n" +
                "Ignidark\n" +
                "railyamag\n" +
                "sophie_e\n" +
                "Nik1TosS\n" +
                "DJ-GisH\n" +
                "dumitru12345\n" +
                "Марат Маматов\n" +
                "Евсей Ковалев\n" +
                "Gardenerofpout\n" +
                "Kristi Barton\n" +
                "daniil_obuhov\n" +
                "Naysha\n" +
                "Sandra Vichuk\n" +
                "Umbracone\n" +
                "Dreamer1996\n" +
                "Levyshka\n" +
                "Tanuy777\n" +
                "Егор Коновалов\n" +
                "Addicted_to_movies\n" +
                "Лиза Панчишина\n" +
                "MilesDayson\n" +
                "ElenaYou\n" +
                "k1n0tester\n" +
                "Денис Юрьев\n" +
                "The Lord Of Salem\n" +
                "sbun126\n" +
                "KostoPinto\n" +
                "kgstan\n" +
                "Natsakero\n" +
                "Дмитрий Храмцов\n" +
                "Misha Mikhailov\n" +
                "atonwarno\n" +
                "dasa353\n" +
                "Mr Millionaire\n" +
                "Инфонт\n" +
                "KiNoManKa1995\n" +
                "BossTrilla\n" +
                "DruG AddicT\n" +
                "Mr Os\n" +
                "Станислав Устинов\n" +
                "Beatifull Mess\n" +
                "NaumovaS\n" +
                "VioletLord\n" +
                "Miss Moonlight 13\n" +
                "theZinel\n" +
                "Просто Валера\n" +
                "jonut\n" +
                "shmeedvig\n" +
                "Daniel Palacios\n" +
                "Petra Maentek\n" +
                "DeliriousKate\n" +
                "Gorhla\n" +
                "MrKiteRage\n" +
                "kamyninkonstantin\n" +
                "Merkwood\n" +
                "Sylvia Evans\n" +
                "Джейк Грин\n" +
                "iwhisper\n" +
                "Langelena\n" +
                "Pernatiy\n" +
                "rammden13\n" +
                "Neogasi\n" +
                "TikoLime\n" +
                "Ice Cream Century\n" +
                "TimurVandal\n" +
                "ArtemKatz\n" +
                "Александра Скальская\n" +
                "improvizatoric\n" +
                "tarantin\n" +
                "vkopirait\n" +
                "_sam_\n" +
                "MrFrage\n" +
                "sporter21\n" +
                "Ксения Чугай\n" +
                "Genserius\n" +
                "darksun14\n" +
                "Кинишко\n" +
                "42nisssssssssssssssmo\n" +
                "incognito-00\n" +
                "Biguzim4ik\n" +
                "engyansy\n" +
                "theReaper\n" +
                "Nikta Ignis\n" +
                "Эсфирь_\n" +
                "Reigan16\n" +
                "Дмитрий Чуйко\n" +
                "renod\n" +
                "Barney Gumble\n" +
                "Scarabey\n" +
                "Александр14\n" +
                "Aul\n" +
                "elena str\n" +
                "Solique\n" +
                "Junia\n" +
                "DementorGargoyles\n" +
                "Nick_07\n" +
                "Dmitriy Danbuev\n" +
                "Curly Lady\n" +
                "Sunny_Kate\n" +
                "Sateerik\n" +
                "CHILD OF MOVIE\n" +
                "capmat2510\n" +
                "MisteR_OV\n" +
                "Linarec\n" +
                "Comedy-kino-man\n" +
                "Тушите свет\n" +
                "siroitora\n" +
                "_agattie\n" +
                "devalmont\n" +
                "Сверхновая Звезда\n" +
                "Mr Snowdrop\n" +
                "tpogadaeva\n" +
                "Arsenba\n" +
                "AntonGM\n" +
                "jd\n" +
                "romanprag\n" +
                "листок\n" +
                "Денис Лю\n" +
                "Александр Голубцов\n" +
                "Mllnprdx\n" +
                "S1ava\n" +
                "Константин Мельников\n" +
                "dkulinar\n" +
                "MichaelM\n" +
                "Liakiwi\n" +
                "pashtigaV\n" +
                "dumankuandyk\n" +
                "udinfy\n" +
                "ryzhulya_kate\n" +
                "olechka711\n" +
                "независимый эксперт\n" +
                "Дмитрий Евстигнеев\n" +
                "I love movies\n" +
                "FisherIvan\n" +
                "hyperion_\n" +
                "Макс Стоялов\n" +
                "Nekitosenka\n" +
                "jFisher\n" +
                "Слава Одинов\n" +
                "JanMateiko\n" +
                "Filomilka\n" +
                "Violetta G\n" +
                "Head Cutt3r\n" +
                "Kinday\n" +
                "Сергей Викторович\n" +
                "Tsoriev\n" +
                "Katy Katerina\n" +
                "Moustachefan\n" +
                "JulianaLoen\n" +
                "Anne_Maria\n" +
                "Instinkt\n" +
                "boojum\n" +
                "Barnaul_MAN\n" +
                "yankeees\n" +
                "TheMendezHD\n" +
                "blez\n" +
                "x069096596\n" +
                "VernyStar\n" +
                "LordikNPR\n" +
                "smr_an\n" +
                "Rm.Anderson\n" +
                "Eugene Molev\n" +
                "AnJewel\n" +
                "Vadim Dobriy\n" +
                "masterClass\n" +
                "Heywood\n" +
                "expendablesfan\n" +
                "RapedCorpse\n" +
                "alshenetsky\n" +
                "KingJC\n" +
                "ARTEM_JOCKER\n" +
                "red_union\n" +
                "WCW99nWo\n" +
                "lzn04\n" +
                "I still believe in people\n" +
                "margodeeva\n" +
                "Константин Линник\n" +
                "Aurorka\n" +
                "Akkier\n" +
                "Dankasta\n" +
                "392019121\n" +
                "Lordparadox\n" +
                "MyLastPageFirst\n" +
                "Vasya-cheskidov\n" +
                "Ильдар Файзуллин\n" +
                "alexnelin\n" +
                "Alan_Stenvick\n" +
                "evgeni171017\n" +
                "neganoff\n" +
                "Valentin Rodin\n" +
                "Alterhouse\n" +
                "VersuS24\n" +
                "StepDub187\n" +
                "Максим Абросимов\n" +
                "Prince Nuada\n" +
                "MagnificoK\n" +
                "Alpold\n" +
                "DavidEdisson\n" +
                "Екатерина Баранович\n" +
                "Никита Дудинцев\n" +
                "Дремучик\n" +
                "Mind Hunter\n" +
                "VolGov\n" +
                "Neefero\n" +
                "igorfedorov2406956\n" +
                "bagd0s\n" +
                "Uriah Swift\n" +
                "moonwine\n" +
                "Francine\n" +
                "DigHadgen\n" +
                "Артем Таболин\n" +
                "Даниил Саныч\n" +
                "colorowl\n" +
                "dead_undead\n" +
                "Pashakuz99\n" +
                "bogdanpetrenko\n" +
                "Mr Durden\n" +
                "sazanstheme\n" +
                "Elizabeth123\n" +
                "sun_death\n" +
                "Real movie\n" +
                "Avatarovec\n" +
                "Bubblegum99\n" +
                "elkvasya\n" +
                "melanega\n" +
                "Mister A\n" +
                "Vadimets\n" +
                "BlackHoleAngel\n" +
                "Strider6\n" +
                "johnnydepp25041996\n" +
                "soulrocket76\n" +
                "NastyaG212\n" +
                "milana1310\n" +
                "estel_le\n" +
                "Ммиля\n" +
                "Рыбкка\n" +
                "Evgenii GrandMASTER\n" +
                "Кирилл Хозяинов\n" +
                "Фарид Кулиев\n" +
                "kolyajoker\n" +
                "lukinmm\n" +
                "Ivan Menshov\n" +
                "Антикритика\n" +
                "le5h\n" +
                "KinoDoktor\n" +
                "weird0\n" +
                "ArtekusRain\n" +
                "AnReaLTv\n" +
                "Life wonot wait\n" +
                "cineMaxx2194\n" +
                "gannicus88\n" +
                "king metall\n" +
                "Lisa Look\n" +
                "Samura1\n" +
                "Gotskaya\n" +
                "Strol\n" +
                "Paul Paulus\n" +
                "PeRLiK37\n" +
                "Просто Шурик\n" +
                "wadak\n" +
                "calmykov\n" +
                "Иван Волгин\n" +
                "JohnyCooper777\n" +
                "alexfox111\n" +
                "leoneq\n" +
                "Rexhepi\n" +
                "bigsmol\n" +
                "Violent_Syndrome\n" +
                "iwolf13\n" +
                "AsenOsen\n" +
                "Вишневский Иван\n" +
                "mambetshaeva\n" +
                "Alexandr Kinolove\n" +
                "Mockingbird\n" +
                "nnpp\n" +
                "Ирод\n" +
                "Alex_Andre\n" +
                "RuRummm\n" +
                "Waadada\n" +
                "Gaarajuve\n" +
                "Alex Timkov\n" +
                "scorpion1990\n" +
                "Миша-35\n" +
                "MyRZiK72\n" +
                "Aeternaris\n" +
                "Зиммер\n" +
                "snmineev\n" +
                "TrueSoulmate\n" +
                "Arabella_\n" +
                "АнтонПодтынченко\n" +
                "FanatNakovalen\n" +
                "Marty Mitch\n" +
                "KudryashkaSue\n" +
                "Kazumoto\n" +
                "Milanista91\n" +
                "Дэнни Яниев\n" +
                "Foosa13\n" +
                "winter eyes\n" +
                "barislav\n" +
                "Sasha Oreshkina\n" +
                "СияниеРазума\n" +
                "Alkaris\n" +
                "LikaJena\n" +
                "Will Rock\n" +
                "Evgen-S\n" +
                "Kotenot_St\n" +
                "Богдан Кузнецов\n" +
                "bsv_irs\n" +
                "asics28\n" +
                "Влад Чертыков\n" +
                "RedH90\n" +
                "vlad malishev\n" +
                "Farelas\n" +
                "Hypermusic\n" +
                "pentiumman\n" +
                "Upitko\n" +
                "ali_star\n" +
                "ResidentMetal23\n" +
                "Rambaldi\n" +
                "James Siebert\n" +
                "galeksandrp\n" +
                "Зюмыч\n" +
                "Дима Ливень\n" +
                "Явленый\n" +
                "strangerlight\n" +
                "Maksym Moskalenko\n" +
                "Ordinal Number\n" +
                "Павлушка Бебнев\n" +
                "kassirrr\n" +
                "Yogan\n" +
                "-Craft-\n" +
                "DmitrySmirnov\n" +
                "ksuha666\n" +
                "brilliant brown\n" +
                "Shunnimi\n" +
                "Gladiator 77777\n" +
                "Elnora_Elnora\n" +
                "lonely grey\n" +
                "Dima646\n" +
                "GelStick\n" +
                "IanaIashina\n" +
                "EnerTomasino\n" +
                "kq\n" +
                "7unflower\n" +
                "Интакто\n" +
                "Mesai\n" +
                "DB Cooper\n" +
                "Green-Hedgehog\n" +
                "Vlad Silberstein\n" +
                "Арам Манукян\n" +
                "Daniyar Dark Knight\n" +
                "Litenkroft\n" +
                "riviere\n" +
                "Ариада\n" +
                "jahkut\n" +
                "Hannibal McCoy King\n" +
                "trishin-alexei\n" +
                "T - 3000\n" +
                "Incredulous Hawk\n" +
                "cyberlaw\n" +
                "Mihailap\n" +
                "GregoryCheng\n" +
                "майор Шарп\n" +
                "Sir Smith\n" +
                "Вадя Ротор\n";
        List<String> madMaxAuthors = new ArrayList<String>();
        List<String> interAuthors = new ArrayList<String>();
        Pattern pattern = Pattern.compile("\n.+\n");
        Matcher matcher = pattern.matcher(mad);
        while (matcher.find()){
            String str = matcher.group().substring(1,matcher.group().length() - 1);
            madMaxAuthors.add(str);
        }

        Pattern pattern1 = Pattern.compile("\n.+\n");
        Matcher matcher1 = pattern1.matcher(inter);
        while (matcher1.find()){
            String str = matcher1.group().substring(1,matcher1.group().length() - 1);
            interAuthors.add(str);
        }
        List<String> accordingAuthors = new ArrayList<String>();
        for (String temp: madMaxAuthors) {
            for (String temp1: interAuthors) {
                if(temp.equals(temp1)){
                    accordingAuthors.add(temp);
                }
            }
        }
        for (String temp: accordingAuthors) {
            System.out.println(temp);
        }
    }
}
