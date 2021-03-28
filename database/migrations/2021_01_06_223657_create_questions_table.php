<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('question', 200);
            $table->string('options', 100);
            $table->smallInteger('app_id');
            $table->tinyInteger('score')->unsigned()->default(3);
            $table->timestamp('created_at')->useCurrent();
        });
        DB::table('questions')->insert([
            ['question' => 'نتیجه بازی *1* ⚽ *2* ($) را پیش بینی کنید', 'options' => 'برد *1*$مساوی$برد *2*', 'app_id' => 1, 'score' => 3],
            ['question' => 'Predict The Result Of *1* ⚽ *2* ($ utc time) utc time', 'options' => '*1* Wins$Equal$*2* Wins', 'app_id' => 3, 'score' => 3],
            ['question' => 'آیا بازی *1* ، *2* کارت قرمز خواهد داشت؟', 'options' => 'بله$خیر', 'app_id' => 1, 'score' => 2],
            ['question' => 'در بازی *1* ، *2* درصد مالکیت توپ *1* چقدر خواهد بود؟', 'options' => 'زیر 20$20 - 40$40 - 50$50 - 60$60 - 80$80 - 100', 'app_id' => 1, 'score' => 5],
            ['question' => 'آیا بازی *1* ، *2* پنالتی خواهد داشت؟', 'options' => 'بله$خیر', 'app_id' => 1, 'score' => 2],
            ['question' => 'آیا بازی *1* ، *2* دقیقه 80 به بعد گل خواهد داشت؟', 'options' => 'بله$خیر', 'app_id' => 1, 'score' => 2],
            ['question' => 'آیا در بازی *1* ، *2* تیمی کلین شیت خواهد کرد؟', 'options' => 'بله$خیر', 'app_id' => 1, 'score' => 1],
            ['question' => 'آیا بازی *1* ، *2* گل با ضربه سر خواهد داشت؟', 'options' => 'بله$خیر', 'app_id' => 1, 'score' => 2],
            ['question' => 'در بازی *1* ، *2* مجموع کارت های زرد چقدر خواهد بود؟', 'options' => 'زیر 2$2 - 4$5 - 7$بالای 7', 'app_id' => 1, 'score' => 5],
            ['question' => 'اختلاف گل بازی *1* ، *2* چقدر خواهد بود؟', 'options' => '0$1$2$3$بالای 3', 'app_id' => 1, 'score' => 3],
            ['question' => 'آیا در بازی *1* ، *2* ، مهاجمان *1* گل زنی خواهند کرد؟', 'options' => 'بله$خیر', 'app_id' => 1, 'score' => 2],
            ['question' => 'If Will Be Occurred Any Goal With Penalty In *1* ⚽ *2* Match?', 'options' => 'Yes$No', 'app_id' => 3, 'score' => 2],
            ['question' => 'If Will Be Occurred Any Goal After 80 Minute In *1* ⚽ *2* Match?', 'options' => 'Yes$No', 'app_id' => 3, 'score' => 2],
            ['question' => 'If Will Be Occurred Any Goal With Head In *1* ⚽ *2* Match?', 'options' => 'Yes$No', 'app_id' => 3, 'score' => 2],
            ['question' => 'How Many Yellow Cards Will Be Shown In *1* ⚽ *2* Match?', 'options' => '0$1 - 3$4 - 6$7 - 9$Bigger Than 9', 'app_id' => 3, 'score' => 3],
            ['question' => 'What Will Be The Goal Difference In *1* ⚽ *2* Match?', 'options' => '0$1$2$3$4$Bigger Than 4', 'app_id' => 3, 'score' => 3],
            ['question' => 'What Will Be The Possession Percent Of *1* In *1* ⚽ *2* Match?', 'options' => 'Below 10%$10% - 30%$30% - 40%$40% - 50%$50% - 60%$60% - 70%$Bigger Than 70%', 'app_id' => 3, 'score' => 3],
            ['question' => 'If Will Be Shown Any Red Card In *1* ⚽ *2* Match?', 'options' => 'Yes$No', 'app_id' => 3, 'score' => 1],
            ['question' => 'What Will Be The Pass Counts Of *1* In *1* ⚽ *2* Match?', 'options' => 'Below 200 - 200$300 - 301$400 - 401$500 - 501$600 - 601$700 - Upper Than 700', 'app_id' => 3, 'score' => 3],
            ['question' => 'What Will Be The Corner Counts Of *1* In *1* ⚽ *2* Match?', 'options' => '0 - 1$2 - 3$4 - 4$5 - 5$6 - 6$7 - Upper Than 7', 'app_id' => 3, 'score' => 3],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
